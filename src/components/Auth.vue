<template>
  <div class="text-center">
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
import  Axios from 'axios'

@Component
export default class Auth extends Vue {
  public dialog = true;

  authRequest() {
  Axios.post(
        'https://accounts.spotify.com/api/token',
        {'grant_type' : 'grant_type'}, 
        {
            headers: { 
                'Authorization': Buffer.from(process.env.VUE_APP_SPOTIFY_CLIENT_ID + ':' + process.env.VUE_APP_SPOTIFY_CLIENT_SECRET, 'base64'),
            }
        }
).then(response => {
    console.log(response);
});}

}
</script>

<style lang="scss"></style>
