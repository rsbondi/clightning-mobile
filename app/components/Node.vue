<template>
  <Page @navigatedTo="getInfo">
    <ActionBar title="Node">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <ScrollView>
      <StackLayout>
        <!-- <FlexboxLayout
          flexDirection="column-reverse"
          justifyContent="space-around"
          alignItems="stretch"
        >
          <Image :src="qrcode" height="300" width="300" alignSelf="center"/>
        </FlexboxLayout> -->
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
// const QRCode = require("qrcode"); // TODO: need some sort of server change to get ip for qr

export default {
  mixins: [Util],
  data() {
    return {
      qrcode: "",
      info: {}
    };
  },
  methods: {
    getInfo() {
      this.callRemote("getinfo").then(data => {
        const result = data.content.toJSON().result;
        this.info = result;
        // QRCode.toDataURL(result.id)
        //   .then(id => {
        //     this.qrcode = id;
        //   })
        //   .catch(err => {
        //     console.error(err);
        //   });
      });
    }
  }
};
</script>