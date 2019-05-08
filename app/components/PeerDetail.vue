<template>
  <Page>
    <ActionBar title="Channel Detail">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
      <ActionItem class="action" @tap="confirmClose" android.position="actionBar">
        <Label text="✖"/>
      </ActionItem>
    </ActionBar>
    <ScrollView>
      <WrapLayout>
        <Label class="label biglabel" text="Peer id" width="100%"/>
        <TextView :text="$props.peer.id" width="100%"/>

        <Label class="label biglabel" text="Peer Connection" width="100%"/>
        <Label class="label" text="connected" width="30%"/>
        <Label :text="$props.peer.connected" width="70%"/>

        <Label v-if="$props.peer.netaddr" class="label" text="address" width="30%"/>
        <Label v-if="$props.peer.netaddr" :text="$props.peer.netaddr[0]" width="70%"/>

        <WrapLayout v-if="$props.peer.channels.length">
          <Label class="label biglabel" text="Channel" width="100%"/>
          <Label class="label" text="state" width="30%"/>
          <Label :text="$props.peer.channel.state" width="70%"/>

          <Label class="label" text="short channel id" width="30%"/>
          <Label :text="$props.peer.channel.short_channel_id" width="70%"/>

          <Label class="label" text="dust_limit" width="30%"/>
          <Label :text="$props.peer.channel.dust_limit_satoshis" width="70%"/>

          <Label class="label" text="their reserve" width="30%"/>
          <Label :text="$props.peer.channel.their_channel_reserve_satoshis" width="70%"/>

          <Label class="label" text="our reserve" width="30%"/>
          <Label :text="$props.peer.channel.our_channel_reserve_satoshis" width="70%"/>

          <Label class="label" text="spendable msat" width="30%"/>
          <Label :text="$props.peer.channel.spendable_msatoshi" width="70%"/>

          <Label class="label" text="in msatoshi" width="30%"/>
          <Label :text="$props.peer.channel.in_msatoshi_fulfilled" width="70%"/>

          <Label class="label" text="out msatoshi" width="30%"/>
          <Label :text="$props.peer.channel.out_msatoshi_fulfilled" width="70%"/>
        </WrapLayout>

        <Label class="label biglabel" text="PEER" width="100%"/>
        <ScrollView orientation="horizontal" width="100%">
          <TextView :text="JSON.stringify($props.peer.original, null, 2)"/>
        </ScrollView>
      </WrapLayout>
    </ScrollView>
  </Page>
</template>

<script>
import Util from "./util";

export default {
  props: ["peer"],
  mixins: [Util],
  data() {
    return {};
  },
  methods: {
    confirmClose() {
      confirm("Are you sure you want to close this channel?").then(ok => {
        if (ok) {
          this.callRemote("close", [this.$props.peer.channel.channel_id]).then(data => {
            const response = data.content.toJSON();
            if (response.error) return alert(response.error.message);
            const result = response.result;
            global.eventBus.$emit("channelclose", this.$props.peer.channel.channel_id);
            this.$navigateBack();
          });
        }
      });
    }
  }
};
</script>