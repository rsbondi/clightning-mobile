<template>
  <Page>
    <ActionBar title="Settings">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextField v-model="remoteUrl" hint="Remote Url" autocapitalizationType="none"/>
      <TextField v-model="remoteUser" hint="Remote User" autocapitalizationType="none"/>
      <TextField v-model="remotePassword" secure="true" hint="Remote Password"/>
      <TextField v-model="appPassword" secure="true" hint="App Password"/>
      <WrapLayout>
        <Label text="Show RPC Tab" width="50%"/>
        <Switch v-model="showRPC" width="50%"/>
        <Label text="Show Custom Tab" width="50%"/>
        <Switch v-model="showCustom" width="50%"/>
      </WrapLayout>
      <Button text="Update" @tap="update"/>
    </StackLayout>
  </Page>
</template>

<script>
const SecureStorage = require("nativescript-secure-storage").SecureStorage;
const secureStorage = new SecureStorage();
const appSettings = require("application-settings");

import App from "./App";

export default {
  data() {
    return {
      remoteUrl: "",
      remoteUser: "",
      remotePassword: "",
      appPassword: "",
      showCustom: false,
      showRPC: true
    };
  },
  methods: {
    async update() {
      await secureStorage.set({ key: "remoteUrl", value: this.remoteUrl });
      await secureStorage.set({ key: "remoteUser", value: this.remoteUser });
      if (this.remotePassword) {
        await secureStorage.set({
          key: "remotePassword",
          value: this.remotePassword
        });
        global.remotePassword = this.remotePassword;
      }
      if (this.appPassword) {
        await secureStorage.set({
          key: "appPassword",
          value: this.appPassword
        });
        global.appPassword = this.appPassword;
      }
      global.remoteUrl = this.remoteUrl;
      global.remoteUser = this.remoteUser;
      global.showCustom = this.showCustom;
      appSettings.setBoolean("showCustom", this.showCustom);
      global.showRPC = this.showRPC;
      appSettings.setBoolean("showRPC", this.showRPC);

      this.$navigateTo(App);
    }
  },
  mounted() {
    setTimeout(async () => {
      const url = await secureStorage.get({ key: "remoteUrl" });
      const user = await secureStorage.get({ key: "remoteUser" });

      if (typeof url != "undefined") this.remoteUrl = url;

      if (typeof user != "undefined") this.remoteUser = user;

      global.showCustom = appSettings.getBoolean("showCustom", false);
      this.showCustom = global.showCustom;

      global.showRPC = appSettings.getBoolean("showRPC", true);
      this.showRPC = global.showRPC;
    }, 0);
  }
};
</script>