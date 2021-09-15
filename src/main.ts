import Vue from "vue";
import App from "./App.vue";
import dotenv from "dotenv";

Vue.config.productionTip = false;
dotenv.config();

new Vue({
  render: (h) => h(App),
}).$mount("#app");
