<template>
  <Page>
    <ActionBar title="Peer Detail">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
    <ScrollView>
      <WrapLayout>
        <Label class="label biglabel" text="id" width="100%"/>
        <TextView :text="$props.peer.id" width="100%"/>

        <Label class="label biglabel" text="Connection" width="100%"/>
        <Label class="label" text="connected" width="30%"/>
        <Label :text="$props.peer.connected" width="70%"/>

        <Label class="label" text="address" width="30%"/>
        <Label :text="$props.peer.netaddr[0]" width="70%"/>

        <WrapLayout v-if="$props.peer.channels.length">
            <Label class="label biglabel" text="Channel" width="100%"/>
            <Label class="label" text="state" width="30%"/>
            <Label :text="$props.peer.channels[0].state" width="70%"/>

            <Label class="label" text="short channel id" width="30%"/>
            <Label :text="$props.peer.channels[0].short_channel_id" width="70%"/>

            <Label class="label" text="dust_limit" width="30%"/>
            <Label :text="$props.peer.channels[0].dust_limit_satoshis" width="70%"/>

            <Label class="label" text="their reserve" width="30%"/>
            <Label :text="$props.peer.channels[0].their_channel_reserve_satoshis" width="70%"/>

            <Label class="label" text="our reserve" width="30%"/>
            <Label :text="$props.peer.channels[0].our_channel_reserve_satoshis" width="70%"/>

            <Label class="label" text="spendable msat" width="30%"/>
            <Label :text="$props.peer.channels[0].spendable_msatoshi" width="70%"/>

            <Label class="label" text="in msatoshi" width="30%"/>
            <Label :text="$props.peer.channels[0].in_msatoshi_fulfilled" width="70%"/>

            <Label class="label" text="out msatoshi" width="30%"/>
            <Label :text="$props.peer.channels[0].out_msatoshi_fulfilled" width="70%"/>

        </WrapLayout>

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
