<template>
  <div v-if='containsToken()' class="text-center">
    <v-dialog v-model="dialog" persistent width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Access </v-card-title>

        <v-card-text>
          Authorize the app through your Spotify account.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green" text @click="authRequest"> Here </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Auth extends Vue {
  public dialog = true;

  authRequest() {
    let url = 'https://accounts.spotify.com/authorize';
    url += '?client_id=' + encodeURIComponent(process.env.VUE_APP_SPOTIFY_CLIENT_ID ? process.env.VUE_APP_SPOTIFY_CLIENT_ID : '');
    url += '&redirect_uri=' + encodeURIComponent('https://ammlyy.github.io/spotify-playlist-viz/');
    url += '&response_type=token';
    url+='&state=123'
    window.location.replace(url)    

    this.dialog= false  

  }

  containsToken(){
    if(window.location.hash) return false
    else return true
  }
}


</script>

<style lang="scss"></style>
