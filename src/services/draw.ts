import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Drawable {
  private scene: any
  private camera: any
  private renderer: any
  private controls: any

  init() {
    const container = document.getElementById('container');
    if (container) {
      this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10);
      this.camera.position.z = 1;

      this.scene = new THREE.Scene();

      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      const material = new THREE.MeshBasicMaterial();

      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);


      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);     
     
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );

      container.appendChild(this.renderer.domElement);

    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update()
    this.renderer.render(this.scene, this.camera);
  }

}

export { Drawable };