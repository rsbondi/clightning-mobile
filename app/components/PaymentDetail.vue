<template>
  <Page>
    <ActionBar title="Payment Detail">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <ScrollView>
      <WrapLayout>
        <Label class="label" text="id" width="30%"/>
        <Label :text="$props.payment.id" width="70%"/>

        <Label class="label" text="msatoshi" width="30%"/>
        <Label :text="$props.payment.msatoshi" width="70%"/>

        <Label class="label" text="fee" width="30%"/>
        <Label :text="$props.payment.msatoshi_sent   - $props.payment.msatoshi" width="70%"/>

        <Label class="label" text="status" width="30%"/>
        <Label :text="$props.payment.status" width="70%"/>

        <Label class="label" text="description" width="30%"/>
        <Label :text="$props.payment.label" width="70%"/>

        <Label class="label" text="time" width="30%"/>
        <Label :text="(new Date($props.payment.created_at * 1000).toString())" width="70%"/>

        <Label class="label biglabel" text="payment hash" width="100%"/>
        <TextView :text="$props.payment.payment_hash" width="100%"/>

        <Label class="label biglabel" text="destination" width="100%"/>
        <TextView :text="$props.payment.destination" width="100%"/>

        <Label class="label biglabel" text="payment preimage" width="100%"/>
        <TextView :text="$props.payment.payment_preimage" width="100%"/>

        <Label class="label biglabel" text="payment request" width="100%"/>
        <TextView :text="$props.payment.bolt11" width="100%"/>

        <Label class="label biglabel" text="JSON" width="100%"/>
        <ScrollView orientation="horizontal" width="100%">
          <TextView :text="JSON.stringify($props.payment, null, 2)"/>
        </ScrollView>
      </WrapLayout>
    </ScrollView>
  </Page>
</template>

<script>
import Util from "./util";

export default {
  props: ["payment"],
  data() {
    return {};
  }
};
</script>

