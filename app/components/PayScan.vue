<template>
  <Page @navigatedTo="scanQrCode">
    <ActionBar title="Scan Invoice">
      <NavigationButton text="Go back" android.systemIcon="ic_menu_back" @tap="$navigateBack"/>
    </ActionBar>
       <ScrollView>
            <StackLayout ~mainContent>
                <StackLayout class="home-panel">

                </StackLayout>
            </StackLayout>
        </ScrollView>
  </Page>
</template>

<script>
import { BarcodeScanner } from "nativescript-barcodescanner";
import Pay from "./Pay";
const clipboard = require("nativescript-clipboard");


export default {
  data() {
    return {
      loaded: false
    };
  },
  methods: {
    scanQrCode() {
      setTimeout(() => {
        const scanner = new BarcodeScanner();
        this.loaded = true;
        scanner.scan({
            formats: "QR_CODE",
            cancelLabel: "Close",
            cancelLabelBackgroundColor: "#FFFFFF",
            message: "Use the volume buttons for extra light",
            showFlipCameraButton: false,
            preferFrontCamera: false,
            showTorchButton: true,
            beepOnScan: true,
            torchOn: false,
            closeCallback: () => {
              console.log("Scanner closed");
            },
            resultDisplayDuration: 500,
            orientation: "portrait",
            openSettingsIfPermissionWasPreviouslyDenied: true
          }).then(
            result => {
              clipboard.getText(result.text).then(() => this.$navigateTo(Pay))
            },
            errorMessage => {
              console.log("No scan. " + errorMessage);
            }
          );
      }, 5000);
    }
  },
  mounted() {}
};
</script>