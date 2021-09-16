<template>
  <div id="app">
    <input v-model="link" placeholder="Insert playlist link ..." />
    <button v-on:click="compute"> Search playlist </button>
    <Canva ref='canvas'/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Extractor } from './services/feature_extractor'

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

  compute():void{
    this.extractor.fetchPlaylist(this.link)
    .then( (songs) => this.extractor.extractFeatures(songs) )
    .then((features:any) => this.extractor.trainModel(features) )
    .then((points:any) => this.$emit('dataChanged', points) )

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
