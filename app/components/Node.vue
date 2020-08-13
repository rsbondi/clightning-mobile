<template>
  <Page @navigatedTo="getInfo">
    <ActionBar title="Node">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <ScrollView>
      <StackLayout>
        <FlexboxLayout
          flexDirection="column-reverse"
          justifyContent="space-around"
          alignItems="stretch"
        >
          <Image :src="qrcode" height="300" width="300" alignSelf="center"/>
        </FlexboxLayout>
        <TextView :text="connectString" />
        <Button text="Copy" @tap="clip"/>
        <WrapLayout>

          <Label class="label" text="alias" width="30%"/>
          <Label :text="info.alias" width="70%"/>

          <Label class="label" text="version" width="30%"/>
          <Label :text="info.version" width="70%"/>

          <Label class="label" text="network" width="30%"/>
          <Label :text="info.network" width="70%"/>

          <Label class="label" text="blockheight" width="30%"/>
          <Label :text="info.blockheight" width="70%"/>

          <Label class="label biglabel" text="id" width="100%"/>
          <TextView :text="info.id"/>

          <Label class="label biglabel" text="JSON" width="100%"/>
          <ScrollView orientation="horizontal" width="100%">
            <TextView :text="JSON.stringify(info, null, 2)"/>
          </ScrollView>
        </WrapLayout>

      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import Util from "./util";
const qrcode = require('qrcode-generator')

const clipboard = require("nativescript-clipboard");

export default {
  mixins: [Util],
  data() {
    return {
      qrcode: "",
      info: {},
      connectString: ""
    };
  },
  methods: {
    getInfo() {
      this.callRemote("getinfo").then(data => {
        const result = data.content.toJSON().result;
        this.info = result;
        if(result.address.length) {
          this.connectString = `${result.id}@${result.address[0].address}:${result.address[0].port}`
        } else {
          const nohttps = global.remoteUrl.split('//')[1]
          const noport = nohttps.split(':')[0]
          this.connectString = `${result.id}@${noport}:${result.binding[0].port}`
        }
        const typeNumber = 0;
        const errorCorrectionLevel = 'Q';
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(this.connectString);
        qr.make();

        this.qrcode = qr.createDataURL()

      });
    },
    clip() {
      clipboard.setText(this.connectString).then(function() {}); // TODO: toast
    }
  }
};
</script>