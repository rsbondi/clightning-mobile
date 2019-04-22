<template>
  <Page>
    <ActionBar title="Peer Detail">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <ScrollView>
      <WrapLayout>
        <!-- <Label class="label" text="id" width="30%"/>
        <Label :text="$props.peer.id" width="70%"/>


        <Label class="label biglabel" text="payment hash" width="100%"/>
        <TextView :text="$props.peer.payment_hash" width="100%"/> -->

        <Label class="label biglabel" text="JSON" width="100%"/>
        <ScrollView orientation="horizontal" width="100%">
          <TextView :text="JSON.stringify($props.peer, null, 2)"/>
        </ScrollView>
      </WrapLayout>
    </ScrollView>
  </Page>
</template>

<script>
import Util from "./util";

export default {
  props: ["peer"],
  data() {
    return {};
  }
};
</script>
