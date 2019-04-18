<template>
  <Page>
    <ActionBar title="Invoice">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextField v-model="sats" hint="Amount" keyboardType="number"/>
      <TextField v-model="description" hint="Description"/>
      <Button text="Get Invoice" @tap="getInvoice"/>
      <FlexboxLayout v-if="this.bolt11.length">
        <Image :src="qrcode" stretch="aspectFill" height="400" width="400" alignSelf="center" />
      </FlexboxLayout>
      <Button v-if="this.bolt11.length" text="Copy" @tap="clip"/>
      <TextView :text="bolt11"/>
    </StackLayout>
  </Page>
</template>

<script>
import Util from "./util";
const clipboard = require("nativescript-clipboard");
const QRCode = require("qrcode");

export default {
  mixins: [Util],
  data() {
    return {
      sats: "",
      description: "",
      bolt11: "",
      qrcode: ""
    };
  },
  methods: {
    getInvoice() {
      this.callRemote("invoice", [
        this.sats * 1000,
        Date.now(),
        this.description
      ]).then(data => {
        const result = data.content.toJSON().result
        this.bolt11 = result.bolt11;
        QRCode.toDataURL(this.bolt11).then(url => {
            this.qrcode = url
          })
          .catch(err => {
            console.error(err);
          });

      });
    },
    clip() {
      clipboard.setText(this.bolt11).then(function() {});
    }
  }
};
</script>