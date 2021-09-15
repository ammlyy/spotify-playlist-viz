<template>
  <div>
    <canvas id='canva'> </canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Canva extends Vue {

}
</script>

<style scoped>
#canva{
  height: 400px;
  width: 1000px;
  border: 1px solid gray;}
</style>
