<template>
  <v-app id="inspire">
    <Auth> </Auth>
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
              <Canva ref="canva" @selectedSong="changeSong" />
            </v-sheet>
            <v-card v-if="selectable">
              <v-card-title>{{ extractor.title }} </v-card-title>
              <v-card-subtitle>{{ extractor.author }} </v-card-subtitle>
              <v-card-text> {{ extractor.description }} </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" sm="3">
            <v-sheet rounded="lg" min-height="268" v>
              <v-card>
                <v-img
                  :src="current_cover"
                  height="300"
                  max-height="300"
                  max-width="300"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>

                <v-card-title> {{ current_song }}</v-card-title>
                <v-card-subtitle> {{ current_artist }}</v-card-subtitle>
              </v-card>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer dark padless>
      <v-card class="flex" flat tile>
        <v-card-title>
          <v-btn
            class="mx-4"
            dark
            icon
            href="https://github.com/ammlyy/spotify-playlist-viz"
            target="_blank"
          >
            <v-icon size="24px"> mdi-github </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-img
            max-height="70"
            max-width="150"
            src="./assets/imgs/Spotify_Logo_RGB_Green.png"
            href="https://www.spotify.com/it/"
          ></v-img>
        </v-card-title>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Extractor } from "./services/feature_extractor";

import Canva from "./components/Canva.vue";
import Auth from "./components/Auth.vue";

@Component({
  components: {
    Canva,
    Auth,
  },
})
export default class App extends Vue {
  public link: string = "";
  public extractor: Extractor = new Extractor();
  private selectable: boolean = false;
  private current_song: string = "";
  private current_artist: string = "";
  private current_cover: string = "";

  mounted() {
    this.extractor.init();
  }

  compute(): void {
    this.extractor
      .fetchPlaylist(this.link)
      .then((songs) => this.extractor.extractFeatures(songs.map((s) => s.id)))
      .then((features: number[][]) => this.extractor.trainModel(features))
      .then((points: any) => {
        this.$emit("dataChanged", points);
        this.selectable = true;
      });
  }

  changeSong(event: any) {
    this.current_song = this.extractor.songs_list[event].title;
    this.current_artist = this.extractor.songs_list[event].artist;
    this.current_cover = this.extractor.songs_list[event].img;
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
</style>
>
