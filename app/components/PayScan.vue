<template>
    <Page>
      <ActionBar title="Scan Invoice">
        <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
      </ActionBar>
      <StackLayout>
        <Label text="Scan Payment Page Here" />
      </StackLayout>
    </Page>

</template>

<script>

    export default {
        data() {
          return {}
        },
        methods: {
        }
    }
</script>