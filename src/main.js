/* eslint-disable no-console */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './components'
import vuetify from './plugins/vuetify';
// import { sync } from 'vuex-router-sync'
import ApiService from "@/common/api.service.js";
import { SET_DEFAULT_ACTION, LOGOUT } from "@/store/actions.type.js"; 

Vue.config.productionTip = false;
ApiService.init();
// sync(store, router)
store.watch(
  state => state.auth.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated) {
      if (router.history.current.name == "login" || router.history.current.name == 'changePassword') {
        store.dispatch(SET_DEFAULT_ACTION).then(() => {
          router.go();
        });
      } else {
        router.push({ name: "login" }, () => {
          store.dispatch(SET_DEFAULT_ACTION);
        });
      }
    }
  }
);

ApiService.initInterceptors(store, LOGOUT);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
