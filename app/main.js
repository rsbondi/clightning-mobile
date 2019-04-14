import Vue from 'nativescript-vue'
import Login from './components/Login'
import VueDevtools from 'nativescript-vue-devtools'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
  Vue.config.debug = true
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')



new Vue({
  render: h => h('frame', [h(Login)])
}).$start()
