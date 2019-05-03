<template>
  <Page>
    <ActionBar flat="true">
      <Label :text="balance" class="balance"/>
      <ActionItem @tap="onTapPay" text="Paste Payment" android.position="popup"/>
      <ActionItem @tap="scanQrCode" text="Scan Payment" android.position="popup"/>
      <ActionItem @tap="onTapInvoice" text="Create Invoice" android.position="popup"/>
      <ActionItem @tap="onTapSettings" text="Settings" android.position="popup"/>
      <ActionItem @tap="onNode" text="Node" android.position="popup"/>
      <ActionItem v-show="selectedIndex < 3" @tap="refresh" text="Refresh" android.position="popup"/>
      <ActionItem @tap="about" text="About" android.position="popup"/>
    </ActionBar>
    <GridLayout columns="*" rows="1*">
      <TabView col="0" row="0" :selectedIndex="selectedIndex" @selectedIndexChange="indexChange">
        <TabViewItem title="Payments">
          <ListView for="pay in payments" @itemTap="onTapPaymentList">
            <v-template>
              <GridLayout columns="3* 1*" rows="1* 1*" class="list">
                <Label
                  :text="(new Date(pay.created_at * 1000).toString())"
                  height="20"
                  col="0"
                  row="0"
                />
                <Label
                  :text="pay.msatoshi/ 1000"
                  :class="pay.status == 'failed' ? `failed` : `spent`"
                  style.textAlignment="right"
                  height="20"
                  col="1"
                  row="0"
                />
                <Label :text="pay.label || pay.destination" height="30" col="0" row="1" colspan="2" class="desc" />
              </GridLayout>
            </v-template>
          </ListView>
        </TabViewItem>
        <TabViewItem title="Invoices">
          <ListView for="inv in invoices" @itemTap="onTapInvoiceList">
            <v-template>
              <GridLayout columns="3* 1*" rows="1* 1*" class="list">
                <Label
                  :text="(new Date((inv.paid_at ? inv.paid_at : inv.expires_at) *1000).toString())"
                  :class="inv.status == 'unpaid' ? 'spent' :  inv.status == 'expired' ? 'spent failed' : ''"
                  height="20"
                  col="0"
                  row="0"
                  class="gap"
                />
                <Label
                  :text="inv.msatoshi/1000"
                  :class="inv.status == 'paid' ? 'mine' : inv.status == 'expired' ? 'failed' : ''"
                  style.textAlignment="right"
                  height="20"
                  col="1"
                  row="0"
                />
                <Label :text="inv.description" height="30" col="0" row="1" colspan="2" class="desc" />
              </GridLayout>
            </v-template>
          </ListView>
        </TabViewItem>
        <TabViewItem title="Channels">
          <ListView for="peer in peers" @itemTap="onTapPeerList">
            <v-template>
              <GridLayout columns="1* 1* 1*" rows="1*" class="list chan">
                <Label
                  :class="peer.connected ? '' : 'failed'"
                  :text="peer.id"
                  height="40"
                  col="0"
                  row="0"
                />
                <Label :text="peer.theirs" style.textAlignment="right" height="40" col="1" row="0"/>
                <Label
                  :text="peer.mine"
                  style.textAlignment="right"
                  class="mine"
                  height="40"
                  col="2"
                  row="0"
                />
              </GridLayout>
            </v-template>
          </ListView>
        </TabViewItem>
        <TabViewItem title="Debug">
          <DockLayout stretchLastChild="true">
            <TextField
              dock="top"
              v-model="rpcCommand"
              autocapitalizationType="none"
              hint="Enter rpc command"
            />
            <Button dock="top" text="Execute" @tap="execRPC"/>
            <ScrollView>
              <ScrollView orientation="horizontal">
                <TextView dock="top" :text="rpcResponse"/>
              </ScrollView>
            </ScrollView>
          </DockLayout>
        </TabViewItem>
      </TabView>
    </GridLayout>
  </Page>
</template>

<script>
import Settings from "./Settings";
import About from "./About";
import Pay from "./Pay";
import Node from "./Node";
import Invoice from "./Invoice";
import InvoiceDetail from "./InvoiceDetail";
import PaymentDetail from "./PaymentDetail";
import PeerDetail from "./PeerDetail";
import Util from "./util";
import { BarcodeScanner } from "nativescript-barcodescanner";

global.VERSION = '0.0.2-WIP'

export default {
  mixins: [Util],
  data() {
    return {
      peers: [],
      payments: [],
      invoices: [],
      selectedIndex: -1,
      rpcCommand: "",
      rpcResponse: "",
      selectedInvoice: {},
      balance: "",
      listLoaded: {pays: 0, invoices: 0, peers: 0}
    };
  },
  mounted() {
    global.eventBus = this;
    global.eventBus.$on("payment", bolt11 => {
      this.callRemote("listsendpays", [bolt11]).then(
        data => {
          try {
            this.payments.unshift(data.content.toJSON().result.payments[0]);
          } catch (e) {}
        },
        err => (console.log(`${err}: ${new Date().toString()}`))
      );
    });
    global.eventBus.$on("invoice", label => {
      this.callRemote("listinvoices", [label]).then(
        data => {
          try {
            this.invoices.unshift(data.content.toJSON().result.invoices[0]);
          } catch (e) {}
        },
        err => (console.log(`${err}: ${new Date().toString()}`))
      );
    });
  },
  methods: {
    getFunds() {
      this.callRemote("listfunds").then(data => {
        const balance = data.content
          .toJSON()
          .result.channels.reduce((o, c) => o + c.channel_sat, 0);
        this.balance = `${balance} sats`;
      });
    },
    refresh() {
      this.indexChange({value: this.selectedIndex});
    },
    about() {
      this.$navigateTo(About);
    },
    onNode() {
      this.$navigateTo(Node);
    },
    onTapSettings() {
      this.$navigateTo(Settings);
    },
    onTapPay() {
      this.$navigateTo(Pay);
    },
    onTapInvoice() {
      this.$navigateTo(Invoice);
    },
    onTapInvoiceList(event) {
      this.selectedInvoice = event.item;
      this.$navigateTo(InvoiceDetail, {
        props: { invoice: this.selectedInvoice }
      });
    },
    onTapPaymentList(event) {
      this.$navigateTo(PaymentDetail, { props: { payment: event.item } });
    },
    onTapPeerList(event) {
      this.$navigateTo(PeerDetail, { props: { peer: event.item } });
    },
    indexChange(args) {
      const refresh = this.selectedIndex == args.value;
      this.selectedIndex = args.value;
      switch (this.selectedIndex) {
        case 0:
          if(!this.listLoaded.pays || refresh)
            this.callRemote("listsendpays").then(
              data => {
                this.payments = data.content.toJSON().result.payments.reverse();
                this.listLoaded.pays = 1
              },
              err => (console.log(`${err}: ${new Date().toString()}`))
            );
          this.getFunds();
          break;

        case 1:
          if(!this.listLoaded.invoices || refresh)
            this.callRemote("listinvoices").then(
              data => {
                this.invoices = data.content.toJSON().result.invoices.reverse();
                this.listLoaded.invoices = 1
              },
              err => (console.log(`${err}: ${new Date().toString()}`))
            );

          break;

        case 2:
          if(!this.listLoaded.peers || refresh)
            this.callRemote("listpeers").then(
              data => {
                this.peers = data.content.toJSON().result.peers.map(peer => {
                  if (peer.channels.length) {
                    const mine = Math.floor(
                      peer.channels[0].msatoshi_to_us / 1000
                    );
                    peer.mine = mine;
                    peer.theirs = Math.floor(
                      peer.channels[0].msatoshi_total / 1000 - mine
                    );
                  } else {
                    peers.mine = "";
                    peers.theirs = "";
                  }
                  return peer;
                });
              },
              err => (console.log(`${err}: ${new Date().toString()}`))
            );

          break;
      }
    },
    execRPC() {
      if (!this.rpcCommand) return;
      let mp = this.rpcCommand
        .match(/(?:[^\s"]+|"[^"]*")+/g)
        .map(c => c.replace(/"/g, "")); // split but keep quoted strings
      this.callRemote(mp[0], mp.length > 1 ? mp.slice(1) : []).then(data => {
        this.rpcResponse = JSON.stringify(
          data.content.toJSON().result,
          null,
          2
        );
        this.rpcCommand = "";
      });
    },
    scanQrCode() {
      const scanner = new BarcodeScanner();
      this.loaded = true;
      scanner
        .scan({
          formats: "QR_CODE",
          cancelLabel: "Close",
          cancelLabelBackgroundColor: "#FFFFFF",
          message: "Use the volume buttons for extra light",
          showFlipCameraButton: false,
          preferFrontCamera: false,
          showTorchButton: true,
          beepOnScan: true,
          torchOn: false,
          closeCallback: () => {
            console.log("Scanner closed");
          },
          resultDisplayDuration: 500,
          orientation: "portrait",
          openSettingsIfPermissionWasPreviouslyDenied: true
        })
        .then(
          result => {
            this.$navigateTo(Pay, {
              props: { scantext: result.text }
            });
          },
          errorMessage => {
            console.log("No scan. " + errorMessage);
          }
        );
    }
  }
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

ActionBar label {
  text-align: center;
  vertical-align: middle;
  width: 100%;
}

.list {
  padding-left: 5;
  padding-right: 5;
  padding-top: 10;
}

.chan {
  padding-top: 20;
}

.spent {
  color: red;
}

.failed {
  text-decoration: line-through;
}

.gap {
  padding-right: 5;
}

.mine {
  color: green;
}

.theirs {
  color: goldenrod;
}

.balance {
  background-color: #53ba82;
  color: whitesmoke;
  font-size: 24;
  padding: 8;
  text-align: center;
  vertical-align: middle;
  width: 100%;
}

TextView {
  font-family: monospace;
  font-size: 12;
  background-color: transparent;
  border-color: transparent;
  color: #888;
}

.desc {
  color: #444
}

</style>
