<template>
  <Page @navigatedTo="checkClip">
    <ActionBar title="Pay Invoice">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextView hint="Paste payment request here" v-model="bolt11"/>
      <TextField hint="Label" v-model="label"/>
      <TextField hint="Amount(sat)" v-model="amount" :editable="!hasAmount"/>
      <Button text="Pay" @tap="payInvoice"/>
    </StackLayout>
  </Page>
</template>

<script>
import Util from "./util";
const clipboard = require("nativescript-clipboard");

export default {
  mixins: [Util],
  props: ["scantext"],
  data() {
    return {
      bolt11: "",
      label: "",
      amount: "",
      hasAmount: false
    };
  },
  methods: {
    checkClip() {
      if(this.$props.scantext)
        this.bolt11 = this.$props.scantext
      else
        clipboard.getText().then(clip => {
          if(clip) {
            if(["lnbcrt", "lnbc", "lntb", "lnsb"].filter(l => clip.indexOf(l) === 0).length) {
              this.bolt11 = clip
            }
          }
        })
    },
    payInvoice() {
      this.callRemote("pay", [
        this.bolt11,
        this.hasAmount ? null : this.amount * 1000, // keep in sats
        this.label.replace(/'/g, '') // workaraound for https://github.com/ElementsProject/lightning/issues/2597
      ]).then(data => {
        const response = data.content.toJSON()
        if(response.error) return alert(response.error.message)
        const result = response.result;
        if (result.status == "complete") {
          alert(`payment success for ${result.amount_msat}`).then(() => {
            this.bolt11 = "";
            this.label = "";
            this.amount = "";
          });
        }
        global.eventBus.$emit('payment', result.bolt11)
      }, console.log);
    }
  },
  watch: {
    bolt11(b11) {
      if (b11) {
        this.callRemote("decodepay", [this.bolt11]).then(data => {
          const result = data.content.toJSON().result;
          if (result.msatoshi) {
            this.hasAmount = true;
            this.amount = result.msatoshi / 1000;
            this.label = result.description;
          }
        });
      }
    }
  }
};
</script>