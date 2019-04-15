<template>
  <Page>
    <ActionBar title="Settings">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextField v-model="remoteUrl" hint="Remote Url" autocapitalizationType="none"/>
      <TextField v-model="remoteUser" hint="Remote User" autocapitalizationType="none"/>
      <TextField v-model="remotePassword" secure="true" hint="Remote Password"/>
      <TextField v-model="appPassword" secure="true" hint="app Password"/>
      <Button text="Update" @tap="update"/>
    </StackLayout>
  </Page>
</template>

<script>
const appSettings = require("application-settings");
import App from "./App";

export default {
  data() {
    return {
      remoteUrl: "",
      remoteUser: "",
      remotePassword: "",
      appPassword: ""
    };
  },
  methods: {
    update() {
      appSettings.setString('remoteUrl', this.remoteUrl)
      appSettings.setString('remoteUser', this.remoteUser)
      appSettings.setString('remotePassword', this.remotePassword)
      appSettings.setString('appPassword', this.appPassword)
      global.remoteUrl = this.remoteUrl;
      global.remoteUser = this.remoteUser;
      global.remotePassword = this.remotePassword;
      global.appPassword = this.appPassword;
      this.$navigateTo(App);
    }
  }
};
</script>