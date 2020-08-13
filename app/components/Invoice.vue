<template>
  <Page>
    <ActionBar title="Invoice">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <ScrollView>
      <StackLayout>
        <TextField v-model="sats" hint="Amount(sats)" keyboardType="number"/>
        <TextField v-model="description" hint="Description"/>
        <Button text="Get Invoice" @tap="getInvoice"/>
        <FlexboxLayout
          v-if="this.bolt11.length"
          flexDirection="column-reverse"
          justifyContent="space-around"
          alignItems="stretch"
        >
          <Image :src="qrcode" height="300" width="300" alignSelf="center"/>
        </FlexboxLayout>
        <Button v-if="this.bolt11.length" text="Copy" @tap="clip"/>
        <TextView :text="bolt11"/>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import Util from "./util";
const clipboard = require("nativescript-clipboard");
const qrcode = require('qrcode-generator')

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
      const label = Date.now() // TODO: better method
      this.callRemote("invoice", [
        this.sats * 1000,
        label,
        this.description
      ]).then(data => {
        const result = data.content.toJSON().result;
        this.bolt11 = result.bolt11;

        const typeNumber = 0;
        const errorCorrectionLevel = 'Q';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(this.bolt11);
        qr.make();

        this.qrcode = qr.createDataURL()

        global.eventBus.$emit("invoice", label);
      });
    },
    clip() {
      clipboard.setText(this.bolt11).then(function() {});
    }
  }
};
</script>