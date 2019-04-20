<template>
  <Page>
    <ActionBar title="Pay Invoice">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextView hint="Paste payment request here" v-model="bolt11"/>
      <TextView hint="Label" v-model="label"/>
      <Button dock="top" text="Pay" @tap="payInvoice"/>
    </StackLayout>
  </Page>
</template>

<script>
import Util from "./util";

export default {
  mixins: [Util],
  data() {
    return {
      bolt11: "",
      label: ""
    };
  },
  methods: {
    payInvoice() {
      this.callRemote("pay", [this.bolt11, null, this.label]).then(data => {
        const result = data.content.toJSON().result;
        if (result.status == "complete") {
          alert(`payment success for ${result.amount_msat}`).then(() => {
            this.bolt11 = ''
            this.label = ''
          });
        }
      }, console.log);
    }
  }
};
</script>