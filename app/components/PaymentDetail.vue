<template>
  <Page>
    <ActionBar title="Payment Detail">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <StackLayout>
      <TextView :text="JSON.stringify($props.payment, null, 2)"/>
    </StackLayout>
  </Page>
</template>

<script>
import Util from "./util";

export default {
  props: ['payment'],
  data() {
    return {
    };
  }
};
</script>