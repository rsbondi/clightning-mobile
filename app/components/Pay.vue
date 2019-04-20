<template>
  <Page>
    <ActionBar title="Pay Invoice">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextView hint="Paste payment request here" v-model="bolt11"/>
      <TextField hint="Label" v-model="label"/>
      <TextField hint="Amount(msat)" v-model="amount" :editable="!hasAmount"/>
      <Button dock="top" text="Pay" @tap="payInvoice"/>
    </StackLayout>
  </Page>
</template>

<script>
import Util from "./util";

export default {
  mixins: [Util],
  data() {
    return {
      bolt11: "",
      label: "",
      amount: "",
      hasAmount: false
    };
  },
  methods: {
    payInvoice() {
      this.callRemote("pay", [
        this.bolt11,
        this.hasAmount ? null : this.amount,
        this.label
      ]).then(data => {
        const result = data.content.toJSON().result;
        if (result.status == "complete") {
          alert(`payment success for ${result.amount_msat}`).then(() => {
            this.bolt11 = "";
            this.label = "";
            this.amount = "";
          });
        }
      }, console.log);
    }
  },
  watch: {
    bolt11(b11) {
      console.log("watching bolt11");
      if (b11) {
        this.callRemote("decodepay", [this.bolt11]).then(data => {
          const result = data.content.toJSON().result;
          if (result.msatoshi) {
            this.hasAmount = true;
            this.amount = result.msatoshi;
            this.label = result.description;
          }
        });
      }
    }
  }
};
</script>