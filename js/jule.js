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

let rotationX = 0.000
let rotationY = 0.000

// var x = 0, y = 0;

// var heartShape = new THREE.Shape();

// heartShape.moveTo( x + 5, y + 5 );
// heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
// heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7, x - 6, y + 7 );
// heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
// heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
// heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
// heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

// group.add(heartShape)

let text = "Julia von Schottky"

var loader = new THREE.FontLoader()
loader.load('./assets/fonts/helvetiker_regular.typeface.json', function(font) {
    let geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 2,
        height: 0.5,
        curveSegments: 24
    })
    geometry.center()

    geometry = new THREE.BufferGeometry().fromGeometry(geometry)
    group.add(new THREE.Mesh(geometry, meshMaterial))


    function f(x,y) {
        if (x <= PI|| x >= PI * 2) {
            return Math.pow(1 - sin(x),0.25)*Math.pow(sin(y*PI),1/4)
        }
        else if (x <= 5*PI/4) {
            return Math.pow(sin(y*PI),1/4)
        }
        else if (x <= 3*PI/2) {
            let r = 1
            let theta = PI/4 - (3*PI/2 - x)
            let ad = r / cos(theta) 
            let fac = 0.97 + 0.03*cos(theta*4)
            return fac*ad*Math.pow(sin(y*PI),1/4)
        }
        else if (x <= 7*PI/4) {
            let r = 1
            let theta = PI*7/4 - x
            let ad = r / cos(theta)
            let fac = 0.97 + 0.03*cos((theta)*4)
            return fac*ad*Math.pow(sin(y*PI),1/4)
        }
        else {
            return Math.pow(sin(y*PI),1/4)
        }
    }
    window.extrusionFunction = (x,y) => f(x,y)
    
    guis.CylinderGeometry(group,
        0, 0, 1, 2, PI/2, 0, PI/2)
    guis.LightsOptions(lights)
    guis.MaterialOptions(group)
    guis.CameraOptions(orbit, camera, data => {
        rotationX = data.dx
        rotationY = data.dy
    })
})

scene.add(group)

var render = function () {
    
    requestAnimationFrame( render );

    if ( true ) {

        group.rotation.x += rotationX;
        group.rotation.y += rotationY;

        geo.rotateX(0.01)
        geo.rotateY(0.007)
        geo.rotateZ(0.12)
    }

    renderer.render( scene, camera );

};

window.addEventListener( 'resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();
