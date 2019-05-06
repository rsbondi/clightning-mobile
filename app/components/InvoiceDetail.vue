<template>
  <Page>
    <ActionBar title="Invoice Detail">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
      <ActionItem class="action" @tap="confirmDelete" android.position="actionBar">
        <Label text="🗑️"/>
      </ActionItem>
    </ActionBar>
    <ScrollView>
      <WrapLayout>
        <Label class="label" text="label" width="30%"/>
        <Label :text="$props.invoice.label" width="70%"/>

        <Label class="label" text="msatoshi" width="30%"/>
        <Label :text="$props.invoice.msatoshi" width="70%"/>

        <Label class="label" text="status" width="30%"/>
        <Label :text="$props.invoice.status" width="70%"/>

        <Label class="label" text="description" width="30%"/>
        <Label :text="$props.invoice.description" width="70%"/>

        <Label v-if="$props.invoice.status=='paid'" class="label" text="pay index" width="30%"/>
        <Label v-if="$props.invoice.status=='paid'" :text="$props.invoice.pay_index" width="70%"/>

        <Label
          class="label"
          :text="$props.invoice.status=='paid' ? 'paid' : 'expires'"
          width="30%"
        />
        <Label
          v-if="$props.invoice.status=='paid'"
          :text="(new Date($props.invoice.paid_at * 1000).toString())"
          width="70%"
        />
        <Label
          v-if="$props.invoice.status!='paid'"
          :text="(new Date($props.invoice.expires_at * 1000).toString())"
          width="70%"
        />

        <Label class="label biglabel" text="payment hash" width="100%"/>
        <TextView :text="$props.invoice.payment_hash" width="100%"/>

        <Label class="label biglabel" text="payment request" width="100%"/>
        <TextView :text="$props.invoice.bolt11" width="100%"/>

        <Label class="label biglabel" text="JSON" width="100%"/>
        <ScrollView orientation="horizontal" width="100%">
          <TextView :text="JSON.stringify($props.invoice, null, 2)"/>
        </ScrollView>
      </WrapLayout>
    </ScrollView>
  </Page>
</template>

<script>
import Util from "./util";

export default {
  props: ["invoice"],
  mixins: [Util],
  data() {
    return {};
  },
  methods: {
    confirmDelete() {
      confirm("Are you sure you want to delet this invoice?").then(result => {
        if(result) {
          this.callRemote("delinvoice", [this.$props.invoice.label, this.$props.invoice.status]).then(data => {
            const result = data.content.toJSON().result
            global.eventBus.$emit('delinvoice', result.label);
            this.$navigateBack();
          });
        }
      });
    }
  }
};
</script>

<style>
.action {
  font-size: 24;
}
</style>