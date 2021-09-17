<template>
  <canvas id='c'> </canvas>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Drawable } from "../services/draw";

@Component
export default class Canva extends Vue {
  private drw: Drawable = new Drawable();

  mounted(): void {
    this.drw.init();
    this.drw.animate();
    this.$root.$children[0].$on("dataChanged", this.drawPlaylist);
  }

  drawPlaylist(points: any) {
    console.log('received')
    this.drw.instantiate(points.length, points);
  }
}
</script>

<style scoped>
#c {
  width: 100%;
  height: 100%;
}
</style>
