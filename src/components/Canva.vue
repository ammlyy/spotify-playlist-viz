<template>
  <canvas id="c"> </canvas>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Component
export default class Canva extends Vue {
  public inst_id: number = 0;
  private scene: any;
  private camera: any;
  private renderer: any;
  private controls: any;
  private geometry: any;
  private material: any;
  private mesh: any;
  private mouse: THREE.Vector2 = new THREE.Vector2(1, 1);
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  public instance_id: number = 0;

  mounted(): void {
    const container = document.getElementById("c");
    if (container) {
      this.camera = new THREE.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.01,
        10
      );
      this.camera.position.z = 2;
      this.camera.lookAt(0.0, 0.0, 0.0);

      this.scene = new THREE.Scene();

      this.material = new THREE.MeshBasicMaterial();
      this.geometry = new THREE.IcosahedronGeometry(0.5, 3);
      this.geometry.scale(0.2, 0.2, 0.2);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: container,
        alpha: true,
      });
      this.renderer.setClearColor(0x000000, 1);
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      this.renderer.domElement.addEventListener(
        "mousemove",
        this.onMouseMove.bind(this),
        false
      );
      this.controls = new OrbitControls(this.camera, container);
      this.controls.minDistance = 0.7;
      this.controls.maxDistance = 5;

      this.animate();

      this.$root.$children[0].$on("dataChanged", (points: any) =>
        this.instantiate(points.length, points)
      );
    }
  }

  instantiate(length: number, positions: number[][]) {
    this.clear();

    let matrix = new THREE.Matrix4();
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, length);
    for (let i = 0; i < length; i++) {
      matrix = this.translateMatrix(matrix, positions[i]);
      this.mesh.setMatrixAt(i, matrix);
      const c = this.getColor(positions[i]);
      this.mesh.setColorAt(i, c);
    }
    this.scene.add(this.mesh);
    this.scene.needsUpdate = true;
  }

  translateMatrix(matrix: THREE.Matrix4, xyz: number[]) {
    const position = new THREE.Vector3();
    position.x = xyz[0] * 2;
    position.y = xyz[1] * 2;
    position.z = xyz[2] / 2;

    matrix.setPosition(position); // write new positon back

    return matrix;
  }

  getColor(xyz: number[]): THREE.Color {
    return new THREE.Color(
      (xyz[0] + 1) / 2,
      (xyz[1] + 1) / 2,
      (xyz[2] + 1) / 2
    );
  }

  onMouseMove(event: any) {
    event.preventDefault();
    const boundingBox = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x =
      ((event.clientX - boundingBox.left) / boundingBox.width) * 2 - 1;
    this.mouse.y =
      -((event.clientY - boundingBox.top) / boundingBox.height) * 2 + 1;
  }

  clear() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate);
    this.controls.update();
    this.raycaster.setFromCamera(this.mouse, this.camera);
    if (this.mesh) {
      const intersection = this.raycaster.intersectObject(this.mesh);

      if (intersection.length > 0) {
        const instanceId = intersection[0].instanceId
          ? intersection[0].instanceId
          : 0;
        if (this.instance_id != instanceId) {
          this.instance_id = instanceId;
          this.$emit("selectedSong", this.instance_id);
        }
      }
    }
    this.renderer.render(this.scene, this.camera);
  }
}
</script>

<style scoped>
#c {
  width: 100%;
  height: 100%;
}
</style>
