<template>
  <div id="app">
    <input v-model="link" placeholder="Insert playlist link ..." />
    <button v-on:click="searchPlaylist"> Search playlist </button>
    <Canva />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Extractor } from './services/audio'

import Canva from "./components/Canva.vue";

@Component({
  components: {
    Canva,
  },
})
export default class App extends Vue {
  public link: string = '';
  public extractor: Extractor = new Extractor();

  mounted(){
    this.extractor.init()
  }

  searchPlaylist():void{
    this.extractor.fetchPlaylist(this.link)
  }
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
