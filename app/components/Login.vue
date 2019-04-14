<template>
  <Page>
    <ActionBar title="Login"/>
    <StackLayout>
      <TextField v-model="password" secure="true" hint="Enter Password"/>
      <Button text="Login" @tap="validate"/>
    </StackLayout>
  </Page>
</template>

<script>
/*
WARNING, not secure storage, temporary for test
DO NOT USE WITH MORE FUNDS THAN YOU ARE WILLING TO LOSE
nativescript-secure-storage seems broken, on call to hawk.Hawk undefined
*/

import App from "./App";
import Settings from "./Settings";
const appSettings = require("application-settings");
// const SecureStorage = require("nativescript-secure-storage").SecureStorage;
// const secureStorage = new SecureStorage();

// let user;
// try {
//   user = secureStorage.getSync({
//     key: "remoteUser"
//   });
//   console.log(user);
// } catch (e) {
//   console.log(e);
// }

export default {
  data() {
    return {
      password: ""
    };
  },
  methods: {
    validate() {
      if (this.password == global.appPassword)
        this.$navigateTo(App, { clearHistory: true });
      else this.password = "";
    }
  },
  mounted() {
    setTimeout(() => {
      if (typeof appSettings.getString("appPassword") == 'undefined') {
        this.$navigateTo(Settings);
      } else {
        global.remoteUrl = appSettings.getString("remoteUrl");
        global.remoteUser = appSettings.getString("remoteUser");
        global.remotePassword = appSettings.getString("remotePassword");
        global.appPassword = appSettings.getString("appPassword");
      }
    },0)
  }
};
</script>