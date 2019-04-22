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
          key: "appPassword"
        }).then(async pass => {
          if (!pass) {
            this.$navigateTo(Settings);
          } else {
            global.remoteUrl = await secureStorage.get({key: "remoteUrl"})
            global.remoteUser = await secureStorage.get({key: "remoteUser"})
            global.remotePassword = await secureStorage.get({key: "remotePassword"})
            global.appPassword = pass
          }

        })
      } catch (e) {
        console.log(e);
      }
    }, 0);
  }
};
</script>