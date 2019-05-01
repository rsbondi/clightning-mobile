<template>
  <Page>
    <ActionBar title="Node">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <WrapLayout>
      <Label class="label" text="Version" width="25%"/>
      <Label :text="version" width="75%"/>

      <Label class="label" text="Repo" width="25%"/>
      <Label @tap="gorepo" :text="repo" width="75%" color="blue"/>

    </WrapLayout>
  </Page>
</template>
<script>
const utilityModule = require("utils/utils");

export default {
  data() {
    return {
      version: global.VERSION,
      repo: "https://github.com/rsbondi/clightning-mobile"
    };
  },
  methods: {
      gorepo() {
          utilityModule.openUrl(this.repo);
      }
  }
};
</script>