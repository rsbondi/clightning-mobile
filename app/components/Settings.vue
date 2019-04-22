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
const SecureStorage = require("nativescript-secure-storage").SecureStorage;
const secureStorage = new SecureStorage();

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
    async update() {
      await secureStorage.set({key:'remoteUrl', value:this.remoteUrl})
      await secureStorage.set({key:'remoteUser', value:this.remoteUser})
      if(this.remotePassword) {
        await secureStorage.set({key:'remotePassword', value:this.remotePassword})
        global.remotePassword = this.remotePassword;
      }
      if(this.appPassword) {
        await secureStorage.set({key:'appPassword', value:this.appPassword})
        global.appPassword = this.appPassword;
      }
      global.remoteUrl = this.remoteUrl;
      global.remoteUser = this.remoteUser;
      this.$navigateTo(App);
    }
  },
  mounted() {
    setTimeout(async () => {
      const url = await secureStorage.get({key: "remoteUrl"})
      const user = await secureStorage.get({key: "remoteUser"})

      if (typeof url != 'undefined') 
        this.remoteUrl = url

      if (typeof user != 'undefined') 
        this.remoteUser = user
    }, 0)
  }
};
</script>