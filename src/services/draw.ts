import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Drawable {
  private scene: any
  private camera: any
  private renderer: any
  private controls: any
  private geometry: any
  private material: any
  private mesh: any
  private mouse: THREE.Vector2 = new THREE.Vector2(1,1)
  private raycaster: THREE.Raycaster = new THREE.Raycaster()

  constructor(){
    this.mouse = new THREE.Vector2(1,1) 
    window.addEventListener( 'resize', this.onWindowResize.bind(this) );

  }
  init() {
    const container = document.getElementById('container');
    if (container) {
      this.camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10);
      this.camera.position.z = 2
      this.camera.lookAt(0.0, 0.0, 0.0)

      this.scene = new THREE.Scene();
      this.material = new THREE.MeshBasicMaterial();
      this.geometry =  new THREE.IcosahedronGeometry( 0.5, 3 );
      this.geometry.scale(0.2, 0.2, 0.2)
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);     
      this.renderer.setPixelRatio( window.devicePixelRatio );

      this.renderer.domElement.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );

    
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );

      container.appendChild(this.renderer.domElement);
    }

  }

  instantiate(length:number, positions:number[][]){
    let matrix = new THREE.Matrix4();
    this.mesh = new THREE.InstancedMesh( this.geometry, this.material, length );
    for ( let i = 0; i < length; i ++ ) {
      matrix = this.translateMatrix( matrix, positions[i] );
      this.mesh.setMatrixAt( i, matrix );
      const c=  this.getColor(positions[i])
      this.mesh.setColorAt(i, c)
    }
    this.scene.add(this.mesh)
  }


  translateMatrix(matrix: THREE.Matrix4, xyz: number[]){
    const position = new THREE.Vector3();
    position.x = xyz[0] 
    position.y = xyz[1]
    position.z = xyz[2]

		matrix.setPosition( position ); // write new positon back
		
    return matrix
  }

  getColor(xyz:number[]):THREE.Color{
    return new THREE.Color(
      (xyz[0]+1)/2, (xyz[1]+1)/2, (xyz[2]+1)/2
    )
  }

  onMouseMove( event:any ) {

    event.preventDefault();
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;  
  }

  onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

  }

  render() {
   this.raycaster.setFromCamera( this.mouse, this.camera );
    if(this.mesh)
    {
      const intersection = this.raycaster.intersectObject( this.mesh );

      if ( intersection.length > 0 ) {
        const instanceId = intersection[ 0 ].instanceId;
        console.log(instanceId)
        const color = new THREE.Color()
        this.mesh.setColorAt( instanceId, color.setHex( Math.random() * 0xffffff ) );
        this.mesh.instanceColor.needsUpdate = true;
      }
    }
    this.renderer.render(this.scene, this.camera);
  }
    
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update()
    this.render()
  }


}

export { Drawable };