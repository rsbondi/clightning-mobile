import Vue from 'nativescript-vue'
import Login from './components/Login'

if(TNS_ENV !== 'production') {
  Vue.config.debug = true
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')
Vue.registerElement(
  "BarcodeScanner",
  () => require("nativescript-barcodescanner").BarcodeScannerView
);



new Vue({
  render: h => h('frame', [h(Login)])
}).$start()
