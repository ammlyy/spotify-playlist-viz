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
    this.$parent.$on('dataChanged', this.drawPlaylist)

  }

  drawPlaylist(points:any){
    this.drw.instantiate(points.length, points)
  }

}
</script>

<style scoped>
#container{
  height: 400px;
  margin-left:auto;
  margin-right: auto;
  border: 1px solid gray;}
</style>
