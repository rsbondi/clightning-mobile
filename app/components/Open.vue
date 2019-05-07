<template>
  <Page>
    <ActionBar title="Open Channel">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextField hint="id" v-model="nodeId"/>
      <TextField hint="host" v-model="host"/>
      <TextField hint="port" v-model="port"/>
      <TextField hint="Amount(sat)" v-model="amount"/>
      <Button text="Open" @tap="openChannel"/>
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
      nodeId: "",
      host: "",
      port: "",
      amount: ""
    };
  },
  methods: {
    fund() {
      this.callRemote("fundchannel", [this.nodeId, this.amount]).then(data => {
        const response = data.content.toJSON();
        if (response.error) return alert(response.error.message);
        const result = response.result;
        global.eventBus.$emit("channelopen", this.nodeId);
      }, console.log);
    },
    openChannel() {
      if(!this.amount || !this.nodeId || !this.host || !this.port)
        return alert('all fields required')
      this.callRemote("connect", [this.nodeId, this.host, this.port]).then(data => {
        const response = data.content.toJSON();
        if (response.error) return alert(response.error.message);
        const result = response.result;
        this.fund();
      }, console.log);
    }
  }
};
</script>