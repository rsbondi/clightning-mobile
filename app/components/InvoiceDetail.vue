<template>
  <Page>
    <ActionBar title="Invoice Detail">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextView :text="JSON.stringify($props.invoice, null, 2)"/>
    </StackLayout>
  </Page>
</template>

<script>
import Util from "./util";

export default {
  props: ['invoice'],
  data() {
    return {
    };
  }
};
</script>