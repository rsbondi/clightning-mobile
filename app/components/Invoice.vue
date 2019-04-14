<template>
  <Page>
    <ActionBar title="Invoice">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextField v-model="sats" hint="Amount" keyboardType="number"/>
      <TextField v-model="description" hint="Description"/>
      <Button text="Get Invoice" @tap="getInvoice"/>
      <TextView :text="bolt11"/>
      <Button v-if="this.bolt11.length" text="Copy" @tap="clip"/>
    </StackLayout>
  </Page>
</template>

<script>
import Util from "./util";
const clipboard = require("nativescript-clipboard");

export default {
  mixins: [Util],
  data() {
    return {
      sats: "",
      description: "",
      bolt11: ""
    };
  },
  methods: {
    getInvoice() {
      this.callRemote("invoice", [
        this.sats * 1000,
        Date.now(),
        this.description
      ]).then(data => {
        const result = data.content.toJSON().result;
        this.bolt11 = result.bolt11;
      });
    },
    clip() {
      clipboard.setText(this.bolt11).then(function() {
          //alert("invoice copied to the clipboard").then(() => this.bolt11 = '')
        });
    }
  }
};
</script>