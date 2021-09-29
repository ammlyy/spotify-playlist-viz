import Vue from "vue";
import App from "./App.vue";
import dotenv from "dotenv";
import vuetify from "vuetify";
import Vuetify from "vuetify/lib";

Vue.config.productionTip = false;
dotenv.config();
Vue.use(vuetify);

new Vue({
  vuetify: new Vuetify(),
  render: (h) => h(App),
}).$mount("#app");
