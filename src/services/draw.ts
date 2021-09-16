import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Drawable {
  private scene: any
  private camera: any
  private renderer: any
  private controls: any
  private geometry: any
  private material: any

  init() {
    const container = document.getElementById('container');
    if (container) {
      this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10);
      this.camera.position.z = 1;

      this.scene = new THREE.Scene();
      this.material = new THREE.MeshBasicMaterial();
      this.geometry = new THREE.SphereBufferGeometry(0.1)
      this.geometry.scale( 0.2, 0.2, 0.2 );
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);     
     
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );

      container.appendChild(this.renderer.domElement);
    }

  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update()
    this.render()
  }

  render() {
    this.renderer.render(this.scene, this.camera);

  }

  instantiate(length:number, positions:number[][]){
    let matrix = new THREE.Matrix4();
    const mesh = new THREE.InstancedMesh( this.geometry, this.material, length );
    for ( let i = 0; i < length; i ++ ) {
      matrix = this.translateMatrix( matrix, positions[i] );
      mesh.setMatrixAt( i, matrix );
      const c=  this.getColor(positions[i])
      mesh.setColorAt(i, c)
    }
    this.scene.add(mesh)
  }


  translateMatrix(matrix: THREE.Matrix4, xyz: number[]){
    const position = new THREE.Vector3();
    position.x = xyz[0] * 0.5
    position.y = xyz[1] * 0.5
    position.z = xyz[2] * 0.5

		matrix.setPosition( position ); // write new positon back
		
    return matrix
  }

  getColor(xyz:number[]):THREE.Color{
    return new THREE.Color(
      (xyz[0]+1)/2, (xyz[1]+1)/2, (xyz[2]+1)/2
    )
  }


}

export { Drawable };