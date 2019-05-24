const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50)
camera.position.z = 30

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x000000, 1)
document.body.appendChild(renderer.domElement)

const orbit = new THREE.OrbitControls(camera, renderer.domElement)
orbit.enableZoom = true

const lights = [[0,200,0],[100,200,100],[-100,-200,-200]].map(x => {
    let pl = new THREE.PointLight(0xffffff,1,0)
    pl.position.set(x[0],x[1],x[2])
    scene.add(pl)
    return pl
})

const group = new THREE.Group()

const bufferGeo = new THREE.BufferGeometry()
bufferGeo.addAttribute('position', new THREE.Float32BufferAttribute([], 3))

const lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff,transparent:true,opacity:0.5})
const meshMaterial = new THREE.MeshPhongMaterial({color: 0x156289,emissive:0x072534,side:THREE.DoubleSide,flatShading:true})
group.add(new THREE.LineSegments(bufferGeo, lineMaterial))
group.add(new THREE.Mesh(bufferGeo, meshMaterial))

const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })

let rotationX = 0.000
let rotationY = 0.000

guis.CylinderGeometry(group)
guis.CameraOptions(orbit, camera, data => {
    rotationX = data.dx
    rotationY = data.dy
})

scene.add(group)

var prevFog = false;

var render = function () {

    requestAnimationFrame( render );

    if ( true ) {

        group.rotation.x += rotationX;
        group.rotation.y += rotationY;

    }

    renderer.render( scene, camera );

};

window.addEventListener( 'resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();
