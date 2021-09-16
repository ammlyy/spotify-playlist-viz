<template>
  <div id ='container'>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Drawable } from '../services/draw'

@Component
export default class Canva extends Vue {

  private drw : Drawable = new Drawable();

  mounted(): void{
    this.drw.init()
    this.drw.animate()
  }

}
</script>

<style scoped>
#container{
  height: 400px;
  width: 1000px;
  border: 1px solid gray;}
</style>
