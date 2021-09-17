import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify, {
    iconfont:'md',
    theme: {
        dark: true,
      },
      themes: {
        light: {
          primary: "#4682b4",
          secondary: "#b0bec5",
          accent: "#8c9eff",
          error: "#b71c1c",
        },
      },
});

export default new Vuetify({});
