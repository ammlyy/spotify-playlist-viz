<template>
  <v-app id="inspire">

    <v-app-bar app color="black" flat>
      <v-toolbar-title class="title">Spotify Playlist Viz</v-toolbar-title>

    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-container>
          <v-row>
            <v-row justify="space-around" align="center">
              <v-col cols="12" md="6">
                <v-form>
                  <v-text-field
                    v-model="link"
                    label="Insert playlist link ..."
                    required
                  ></v-text-field> </v-form
              ></v-col>
              <v-col cols="12" md="6">
                <v-btn elevation="2" @click="compute" color="secondary">
                  Search playlist
                </v-btn>
              </v-col>
            </v-row>
          </v-row>
        </v-container>

        <v-row>
          <v-col cols="12" sm="9">
            <v-sheet rounded="lg">
              <Canva />
            </v-sheet>
            <v-card> 
              <v-card-title>{{extractor.title}} </v-card-title>
              <v-card-subtitle>{{extractor.author}} </v-card-subtitle>
              <v-card-text> {{extractor.description}} </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="3">
            <v-sheet rounded="lg" min-height="268"> </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Extractor } from "./services/feature_extractor";

import Canva from "./components/Canva.vue";

@Component({
  components: {
    Canva,
  },
})
export default class App extends Vue {
  public link: string = "";
  public extractor: Extractor = new Extractor();

  mounted() {
    this.extractor.init();
  }

  compute(): void {
    this.extractor
      .fetchPlaylist(this.link)
      .then((songs) =>this.extractor.extractFeatures(songs.map(s => s.id)))
      .then((features: number[][]) => this.extractor.trainModel(features))
      .then((points: any) => {
        console.log(points)
        this.$emit("dataChanged", points)
        });
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: "GothamBold";
  src: local("Gotham"), url("./assets/fonts/GothamPro-Bold.woff");
}
@font-face {
  font-family: "GothamLight";
  src: local("Gotham"), url("./assets/fonts/GothamPro-Light.woff");
}
#app {
  font-family: Gotham;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

$font-family: "GothamLight";

.v-application {
  [class*="text-"] {
    color: #36405a;
    font-family: $font-family, sans-serif !important;
  }
  font-family: $font-family, sans-serif !important;
}

.title {
  font-family: "GothamBold";
  color: white;
}
</style>>
