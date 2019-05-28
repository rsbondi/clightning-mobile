<template>
  <Page @navigatedTo="getSettings">
    <ActionBar flat="true">
      <StackLayout>
        <Label :text="balance" class="balance"/>
        <Label :text="onchain" class="balance onchain"/>
      </StackLayout>
      <ActionItem v-show="selectedIndex < 3" @tap="refresh" android.position="actionBar">
        <Label class="action" text="⟳"/>
      </ActionItem>
      <ActionItem @tap="onTapPay" text="Paste Payment" android.position="popup"/>
      <ActionItem @tap="scanQrCode" text="Scan Payment" android.position="popup"/>
      <ActionItem
        v-show="selectedIndex == 2"
        @tap="newChannel"
        text="Open Channel"
        android.position="popup"
      />
      <ActionItem @tap="onTapInvoice" text="Create Invoice" android.position="popup"/>
      <ActionItem @tap="onTapSettings" text="Settings" android.position="popup"/>
      <ActionItem @tap="onNode" text="Node" android.position="popup"/>
      <ActionItem @tap="about" text="About" android.position="popup"/>
      <ActionItem
        v-show="selectedIndex == customIndex"
        @tap="editCustom"
        text="Toggle Custom Edit"
        android.position="popup"
      />
      <ActionItem
        v-show="selectedIndex == customIndex && customCommands.length > 1"
        @tap="showCustomSelect"
        text="Select Custom Command"
        android.position="popup"
      />
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
                <Label
                  :text="pay.label || pay.destination"
                  height="30"
                  col="0"
                  row="1"
                  colspan="2"
                  class="desc"
                />
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
                <Label
                  :text="inv.description"
                  height="30"
                  col="0"
                  row="1"
                  colspan="2"
                  class="desc"
                />
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
                <Label
                  :text="peer.theirs"
                  style.textAlignment="right"
                  height="40"
                  col="1"
                  row="0"
                  :class="peer.channel.state == 'CHANNELD_NORMAL' ? '' : 'failed'"
                />
                <Label
                  :text="peer.mine"
                  style.textAlignment="right"
                  :class="peer.channel.state == 'CHANNELD_NORMAL' ? 'mine' : 'failed'"
                  height="40"
                  col="2"
                  row="0"
                />
              </GridLayout>
            </v-template>
          </ListView>
        </TabViewItem>
        <TabViewItem v-if="showRPC" title="RPC">
          <DockLayout stretchLastChild="true">
            <TextField
              dock="top"
              v-model="rpcCommand"
              autocapitalizationType="none"
              hint="Enter rpc command"
            />
            <Button dock="top" text="Execute" @tap="execRPC"/>
            <Button v-show="rpcCommands.length" dock="top" text="Choose Command" @tap="setCommand"/>
            <ListPicker
              v-show="rpcCommands.length"
              dock="top"
              :items="rpcCommands"
              selectedIndex="-1"
              @selectedIndexChange="rpcSelected"
            />
            <ScrollView>
              <ScrollView orientation="horizontal">
                <TextView dock="top" :text="rpcResponse"/>
              </ScrollView>
            </ScrollView>
          </DockLayout>
        </TabViewItem>
        <TabViewItem v-if="showCustom" title="Custom">
          <StackLayout>
            <StackLayout v-show="!customSelectMode">
              <TextField
                v-show="customEditMode"
                v-model="customCommand"
                hint="enter command"
                autocapitalizationType="none"
              />
              <Button v-show="customEditMode" text="Update" @tap="execCustom"/>
              <Button v-show="customEditMode" text="Save Command" @tap="saveCustom"/>
              <WebView :src="customHtml"/>
            </StackLayout>
            <StackLayout v-if="customSelectMode">
              <Button text="Select" @tap="selectCustom"/>
              <Button text="Remove" @tap="removeCustom"/>
              <ListPicker
                dock="top"
                :items="customCommands"
                :selectedIndex="selectedCustom"
                @selectedIndexChange="customSelected"
              />
            </StackLayout>
          </StackLayout>
        </TabViewItem>
      </TabView>
    </GridLayout>
  </Page>
</template>

<script>
import Settings from "./Settings";
import About from "./About";
import Pay from "./Pay";
import Open from "./Open";
import Node from "./Node";
import Invoice from "./Invoice";
import InvoiceDetail from "./InvoiceDetail";
import PaymentDetail from "./PaymentDetail";
import PeerDetail from "./PeerDetail";
import Util from "./util";
import { BarcodeScanner } from "nativescript-barcodescanner";
const appSettings = require("application-settings");

global.VERSION = "0.0.6-WIP";

export default {
  watch: {
    rpcCommand(v) {
      if (typeof v == "undefined") return;
      if (this.rpcCommand.length > 1) {
        this.getHelp().then(h => {
          const cmd = v.split(" ")[0];
          if (
            h.map(h => h.command.split(" ")[0]).filter(c => "" + c == "" + cmd)
              .length
          )
            return (this.rpcCommands = []); // first word is commmand, don't show help
          this.rpcCommands = h
            .map(h => h.command.split(" ")[0])
            .filter(h => ~h.indexOf(v))
            .sort((a, b) => {
              const aa = a.indexOf(v);
              const bb = b.indexOf(v);
              return aa > bb ? 1 : aa < bb ? -1 : a > b ? 1 : a < b ? -1 : 0;
            });
        });
      }
    }
  },
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
      onchain: 0,
      listLoaded: { pays: 0, invoices: 0, peers: 0 },
      selectedCommand: -1,
      rpcCommands: [], // filtered list for picker
      rpcHelp: [], // all commands
      showCustom: global.showCustom,
      customHtml: `<p>Enter RPC command, update, save when proper result displays</p>`,
      customCommand: "",
      customCommands: [],
      customEditMode: false,
      customSelectMode: false,
      selectedCustom: -1,
      showRPC: global.showRPC
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
        err => console.log(`${err}: ${new Date().toString()}`)
      );
    });
    global.eventBus.$on("invoice", label => {
      this.callRemote("listinvoices", [label]).then(
        data => {
          try {
            this.invoices.unshift(data.content.toJSON().result.invoices[0]);
          } catch (e) {}
        },
        err => console.log(`${err}: ${new Date().toString()}`)
      );
    });
    global.eventBus.$on("delinvoice", label => {
      const inv = this.invoices.filter(i => i.label == label)[0];
      this.invoices.splice(this.invoices.indexOf(inv), 1);
    });
    global.eventBus.$on("channelopen", peerId => {
      this.callRemote("listpeers", [peerId]).then(data => {
        const peer = data.content.toJSON().result.peers[0];
        const channel = peer.channels[peer.channels.length - 1];
        const mine = Math.floor(channel.msatoshi_to_us / 1000);
        const theirs = Math.floor(channel.msatoshi_total / 1000 - mine);
        this.peers.unshift(
          Object.assign(
            { mine: mine, theirs: theirs, channel: channel, original: peer },
            peer
          )
        );
      }, console.log);
    });
  },
  methods: {
    rpcSelected(item) {
      this.selectedCommand = item.value;
    },
    setCommand() {
      if (~this.selectedCommand)
        this.rpcCommand = this.rpcCommands[this.selectedCommand];
    },
    customSelected(item) {
      this.selectedCustom = item.value;
    },
    selectCustom() {
      if (~this.selectedCustom) {
        this.customCommand = this.customCommands[this.selectedCustom];
        this.customSelectMode = false
        setTimeout(() => this.execCustom(), 0)
      }
    },
    removeCustom() {
      if (~this.selectedCustom) {
        confirm("Are you sure you want to remove custom command?").then(ok => {
          if (ok) {
            this.customCommands.splice(this.selectedCustom, 1)
            this.selectedCustom = 0
            global.customCommands = this.customCommands;
            appSettings.setString(
              "customCommands",
              JSON.stringify(global.customCommands)
            );
            if (global.customCommands.length == 1) this.selectCustom()
          }
        });
      }
    },
    getHelp() {
      return new Promise((resolve, reject) => {
        if (this.rpcHelp.length) {
          resolve(this.rpcHelp);
        } else {
          this.callRemote("help")
            .then(data => {
              const result = data.content.toJSON().result;
              if (result) {
                this.rpcHelp = result.help;
                resolve(this.rpcHelp);
              } else {
                reject();
              }
            })
            .catch(reject);
        }
      });
    },
    getFunds() {
      this.callRemote("listfunds").then(data => {
        const result = data.content.toJSON().result;
        const balance = result.channels.reduce((o, c) => o + c.channel_sat, 0);
        this.balance = `${balance} sats`;
        this.onchain = result.outputs.reduce((o, c) => o + c.value, 0);
      });
    },
    newChannel() {
      this.$navigateTo(Open);
    },
    refresh() {
      this.indexChange({ value: this.selectedIndex });
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
      if (refresh || !~this.selectedIndex) this.getFunds();
      this.selectedIndex = args.value;
      switch (this.selectedIndex) {
        case 0:
          if (!this.listLoaded.pays || refresh)
            this.callRemote("listsendpays").then(
              data => {
                this.payments = data.content.toJSON().result.payments.reverse();
                this.listLoaded.pays = 1;
              },
              err => console.log(`${err}: ${new Date().toString()}`)
            );
          break;

        case 1:
          if (!this.listLoaded.invoices || refresh)
            this.callRemote("listinvoices").then(
              data => {
                this.invoices = data.content.toJSON().result.invoices.reverse();
                this.listLoaded.invoices = 1;
              },
              err => console.log(`${err}: ${new Date().toString()}`)
            );

          break;

        case 2:
          if (!this.listLoaded.peers || refresh)
            this.callRemote("listpeers").then(
              data => {
                this.peers = data.content
                  .toJSON()
                  .result.peers.reduce((o, peer) => {
                    peer.channels.forEach(channel => {
                      const mine = Math.floor(channel.msatoshi_to_us / 1000);
                      const theirs = Math.floor(
                        channel.msatoshi_total / 1000 - mine
                      );
                      o.push(
                        Object.assign(
                          {
                            mine: mine,
                            theirs: theirs,
                            channel: channel,
                            original: peer
                          },
                          peer
                        )
                      );
                      // TODO: too tightly coupled, clean up peer/channel relation for here and detail
                    });
                    return o;
                  }, []);
                this.peers.sort((a, b) => {
                  if ("" + a.channel.state == "" + b.channel.state) return 0;
                  else
                    return a.channel.state == "CHANNELD_NORMAL"
                      ? -1
                      : b.channel.state == "CHANNELD_NORMAL"
                      ? 1
                      : 0;
                });
              },
              err => console.log(`${err}: ${new Date().toString()}`)
            );
            break;

          case this.customIndex:
            if (this.customCommand) {
              this.execCustom();
            } else {
              this.customEditMode = true
            }
            break;
      }
    },
    execCustom() {
      this.callRemote(this.customCommand).then(data => {
        this.customHtml = data.content.toJSON().result;
      });
    },
    editCustom() {
      this.customEditMode = !this.customEditMode;
      if (!this.customEditMode && this.customCommand) this.execCustom();
    },
    showCustomSelect() {
      this.customSelectMode = true;
    },
    getSettings() {
      this.showCustom = global.showCustom;
      this.showRPC = global.showRPC;
      this.customCommands = global.customCommands;
      if (this.customCommands.length) {
        this.customCommand = this.customCommands[0];
      }
    },
    saveCustom() {
      if (!~this.customCommands.indexOf(this.customCommand)) {
        this.customCommands.push(this.customCommand);
        global.customCommands = this.customCommands;
        appSettings.setString(
          "customCommands",
          JSON.stringify(global.customCommands)
        );
      }
      this.customEditMode = false;
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
        this.rpcCommands = [];
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
  },
  computed: {
    customIndex() {
      return global.showRPC ? 4 : 3;
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
  padding: 8 8 0 8;
  text-align: center;
  vertical-align: middle;
  width: 100%;
}

.onchain {
  font-size: 14;
  font-style: italic;
  padding: 0 8 8 8;
  height: 24;
}

TextView {
  font-family: monospace;
  font-size: 12;
  background-color: transparent;
  border-color: transparent;
  color: #888;
}

.desc {
  color: #444;
}

.action {
  font-size: 32;
  padding-bottom: 10;
}
</style>
