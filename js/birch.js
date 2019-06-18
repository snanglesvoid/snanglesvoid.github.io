document.addEventListener('DOMContentLoaded', function() {
  function initialise() {
    console.log('initialise')
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth - 300) / window.innerHeight,
      0.1,
      50
    )
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth - 300, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    document.body.appendChild(renderer.domElement)

    const orbit = new THREE.OrbitControls(camera, renderer.domElement)
    orbit.enableZoom = true

    const lights = [[0, 200, 0], [100, 200, 100], [-100, -200, -200]].map(x => {
      let pl = new THREE.PointLight(0xffffff, 1, 0)
      pl.position.set(x[0], x[1], x[2])
      scene.add(pl)
      return pl
    })

    const group = new THREE.Group()

    const bronze = new THREE.MeshPhongMaterial({
      color: 0xcd7f32,
      emissive: 0x673811,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 100,
      reflectivity: 0.5,
    })
    const iron = new THREE.MeshPhongMaterial({
      color: 0x555555,
      emissive: 0x333333,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 50,
      reflectivity: 0.5,
    })
    const gold = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      emissive: 0x885300,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 100,
      reflectivity: 0.5,
    })
    const copper = new THREE.MeshPhongMaterial({
      color: 0xb87333,
      emissive: 0x643118,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 100,
      reflectivity: 0.5,
    })

    const texture = new THREE.TextureLoader().load(
      './assets/BirkKompostionAbstand.png'
    )
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    // texture.repeat.set(400, 400)
    const textureMaterial = new THREE.MeshLambertMaterial({
      transparent: false,
      map: texture,
      side: THREE.DoubleSide,
    })
    const bronzeTexture = new THREE.TextureLoader().load('./assets/copper3.jpg')
    bronzeTexture.wrapS = THREE.RepeatWrapping
    bronzeTexture.wrapT = THREE.RepeatWrapping
    bronzeTexture.repeat.set(4, 4)
    const bronzeTextureMaterial = new THREE.MeshPhongMaterial({
      transparent: false,
      map: bronzeTexture,
      shininess: 100,
      reflectivity: 0.5,
      side: THREE.DoubleSide,
    })

    const goldTexture = new THREE.TextureLoader().load('./assets/gold.jpg')
    goldTexture.wrapS = THREE.RepeatWrapping
    goldTexture.wrapT = THREE.RepeatWrapping
    goldTexture.repeat.set(1, 1)
    const goldTextureMaterial = new THREE.MeshPhongMaterial({
      transparent: false,
      map: goldTexture,
      shininess: 80,
      reflectivity: 0.3,
      side: THREE.DoubleSide,
    })

    const ironTexture = new THREE.TextureLoader().load('./assets/iron.jpg')
    ironTexture.wrapS = THREE.RepeatWrapping
    ironTexture.wrapT = THREE.RepeatWrapping
    ironTexture.repeat.set(1, 1)
    const ironTextureMaterial = new THREE.MeshPhongMaterial({
      transparent: false,
      map: ironTexture,
      shininess: 60,
      reflectivity: 0.3,
      side: THREE.DoubleSide,
    })

    const radialSegments = 280
    const cylinderRadius = 1.15
    const topConeRadius = 0.13

    // const bufferGeo = new THREE.BufferGeometry()
    // bufferGeo.addAttribute('position', new THREE.Float32BufferAttribute([], 3))

    let geometry = new ExtrudedCylinderBufferGeometry(
      cylinderRadius, //data.radiusTop,
      cylinderRadius, //data.radiusBottom,
      4.1, //data.height,
      radialSegments, //data.radialSegments,
      170, //data.heightSegments,
      true, //data.openEnded,
      0, //data.thetaStart,
      2 * Math.PI, //data.thetaLength,
      -0.15,
      imageBrightnessFunction()
    )
    geometry.translate(0.0, 2.15, 0.0)

    geometry.computeVertexNormals()

    let mainCylinderGeometry = new THREE.CylinderGeometry(
      cylinderRadius,
      cylinderRadius,
      4.1,
      radialSegments,
      170,
      true,
      0,
      2 * Math.PI
    )
    mainCylinderGeometry.translate(0, 2.15, 0)

    let bottomDiskGeometry = new THREE.CircleBufferGeometry(
      cylinderRadius, //radius
      radialSegments //segments
    )
    bottomDiskGeometry.rotateX(Math.PI / 2)
    bottomDiskGeometry.translate(0, 0.1, 0)
    let topDiskGeometry = new THREE.RingBufferGeometry(
      topConeRadius,
      cylinderRadius,
      radialSegments,
      1
    )
    topDiskGeometry.rotateX(Math.PI / 2)
    topDiskGeometry.translate(0, 4.2, 0)
    let topDiskCone = new THREE.ConeBufferGeometry(
      topConeRadius, //radius : Float,
      0.15, //height : Float,
      radialSegments, //radialSegments : Integer,
      2, //heightSegments : Integer,
      true, //openEnded : Boolean,
      0, //thetaStart : Float,
      2 * Math.PI //thetaLength : Float)
    )
    topDiskCone.rotateX(Math.PI)
    topDiskCone.translate(0, 4.125, 0)

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    })

    let axisGeometry = new THREE.CylinderBufferGeometry(
      0.1,
      0.1,
      0.05,
      64,
      2,
      false,
      0,
      2 * Math.PI
    )
    axisGeometry.translate(0, -0.025, 0)
    axisGeometry.translate(0, -0.28, 0)

    let connectionGeometry = new THREE.CylinderBufferGeometry(
      1,
      1,
      0.1,
      32,
      2,
      false,
      0,
      2 * Math.PI
    )
    connectionGeometry.translate(0.0, 0.05, 0)

    // const meshMaterial = new THREE.MeshPhongMaterial({
    //   color: 0x444444,
    //   emissive: 0x111111,
    //   side: THREE.DoubleSide,
    //   flatShading: false,
    // })
    let gearGeometry1 = gearGeometry(1.15, 1.05, 96)
    gearGeometry1.rotateX(Math.PI / 2)
    let gearGeometry2 = gearGeometry(0.45, 0.27, 18, {
      steps: 1,
      depth: 0.18,
      bevelEnabled: false,
    })
    gearGeometry2.translate(0, 0, 0.1)
    gearGeometry2.rotateX(Math.PI / 2)

    let gear1 = new THREE.BufferGeometry().fromGeometry(gearGeometry1)
    // group.add(
    //   new THREE.LineSegments(new THREE.WireframeGeometry(gear1), lineMaterial)
    // )

    let gear2 = new THREE.BufferGeometry().fromGeometry(gearGeometry2)
    // group.add(
    //   new THREE.LineSegments(new THREE.WireframeGeometry(gear2), lineMaterial)
    // )

    // group.add(new THREE.Mesh(axisGeometry, ironTextureMaterial))
    // group.add(new THREE.Mesh(connectionGeometry, ironTextureMaterial))
    // group.add(new THREE.Mesh(gear1, goldTextureMaterial))
    // group.add(new THREE.Mesh(gear2, bronzeTextureMaterial))
    group.add(new THREE.Mesh(geometry, bronze))
    // group.add(new THREE.Mesh(mainCylinderGeometry, bronzeTextureMaterial))
    // group.add(new THREE.Mesh(topDiskGeometry, bronzeTextureMaterial))
    // group.add(new THREE.Mesh(bottomDiskGeometry, bronzeTextureMaterial))
    // group.add(new THREE.Mesh(topDiskCone, goldTextureMaterial))

    // group.add(new THREE.LineSegments(gear2, lineMaterial))
    // group.add(
    //   new THREE.LineSegments(
    //     new THREE.WireframeGeometry(geometry),
    //     lineMaterial
    //   )
    // )

    // updateGroupGeometry(group, geometry)

    let rotationX = 0.0
    let rotationY = 0.0

    // guis.MaterialOptions(group)
    guis.CameraOptions(orbit, camera, data => {
      rotationX = -data.dx
      rotationY = -data.dy
    })
    guis.LightsOptions(lights)

    scene.add(group)

    let preventFog = false

    let render = function() {
      requestAnimationFrame(render)
      group.rotation.x += rotationX
      group.rotation.y += rotationY
      renderer.render(scene, camera)
    }

    window.addEventListener(
      'resize',
      function() {
        camera.aspect = (window.innerWidth - 300) / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth - 300, window.innerHeight)
      },
      false
    )

    render()

    document
      .getElementById('exportbtn')
      .addEventListener('click', function(event) {
        console.log('click')
        let exporter = new THREE.STLExporter()
        let stlString = exporter.parse(group, { binary: true })
        let blob = new Blob([stlString], { type: 'text/binary' })
        saveAs(blob, 'birke.stl')
      })
  }

  function imageBrightnessFunction() {
    let img = document.getElementById('birchimg')
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)

    let cctx = canvas.getContext('2d')
    let twopi = Math.PI * 2
    return function(phi, z) {
      let x = Math.floor((phi / twopi) * img.width)
      let y = Math.floor(z * img.height)
      let brightness
      if (x < img.width && y < img.height) {
        brightness = cctx.getImageData(x, y, 1, 1).data[0]
      } else {
        brightness = 255
      }
      // return brightness < 100 ? 1 : 0
      let ret = 1 - brightness / 255
      ret *= 1.4
      ret = Math.min(1, ret)
      // console.log(brightness)
      return ret
      // return brightness > 50 ? 1 : 0
    }
    // return () => Math.random()
  }

  window.imageBrightnessFunction = imageBrightnessFunction

  document.getElementById('birchimg').addEventListener('load', initialise)
})
