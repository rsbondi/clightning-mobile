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
import App from "./App";
import Settings from "./Settings";

const SecureStorage = require("nativescript-secure-storage").SecureStorage;
const secureStorage = new SecureStorage();
const appSettings = require("application-settings");

let user;

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
      try {
        secureStorage.get({
          key: "remoteUrl"
        }).then(async url => {
          if (!url) {
            this.$navigateTo(Settings);
          } else {
            global.appPassword = await secureStorage.get({key: "appPassword"})
            global.remoteUser = await secureStorage.get({key: "remoteUser"})
            global.remotePassword = await secureStorage.get({key: "remotePassword"})
            global.remoteUrl = url
          }
        })
        global.showCustom = appSettings.getBoolean("showCustom", false);
        global.showRPC = appSettings.getBoolean("showRPC", true);
        const customCommands =  appSettings.getString("customCommands");
        global.customCommands = customCommands ? JSON.parse(customCommands) : []
      } catch (e) {
        console.log(e);
      }
    }, 0);
  }
};
</script>