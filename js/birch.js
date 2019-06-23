document.addEventListener('DOMContentLoaded', function() {
  let parameters = {
    radialSegments: 280,
    heightSegments: 170,

    cylinderRadius: 11.5,
    cylinderHeight: 41,
    cylinderExtrusion: 1,

    topConeRadius: 1.3,
    topConeHeight: 1.5,

    connectionHeight: 1.5,
    connectionRadius: 6,

    gear1Height: 1.2,
    gear1InnerRadius: 10.8,
    gear1OuterRadius: 11.7,
    gear1Teeth: 80,

    gear2Height: 2.3,
    gear2InnerRadius: 3,
    gear2OuterRadius: 4.6,
    gear2Teeth: 18,

    axisHeight: 1.1,
    axisRadius: 1.1,

    refresh: 0,
  }

  let bronze, iron, gold, copper, lineMaterial
  let textureMaterial,
    bronzeTextureMaterial,
    ironTextureMaterial,
    goldTextureMaterial
  function initialiseMaterials() {
    lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    })

    bronze = new THREE.MeshPhongMaterial({
      color: 0xcd7f32,
      emissive: 0x673811,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 100,
      reflectivity: 0.5,
    })
    iron = new THREE.MeshPhongMaterial({
      color: 0x555555,
      emissive: 0x333333,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 50,
      reflectivity: 0.5,
    })
    gold = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      emissive: 0x885300,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 100,
      reflectivity: 0.5,
    })
    copper = new THREE.MeshPhongMaterial({
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
    textureMaterial = new THREE.MeshLambertMaterial({
      transparent: false,
      map: texture,
      side: THREE.DoubleSide,
    })
    const bronzeTexture = new THREE.TextureLoader().load('./assets/copper3.jpg')
    bronzeTexture.wrapS = THREE.RepeatWrapping
    bronzeTexture.wrapT = THREE.RepeatWrapping
    bronzeTexture.repeat.set(4, 4)
    bronzeTextureMaterial = new THREE.MeshPhongMaterial({
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
    goldTextureMaterial = new THREE.MeshPhongMaterial({
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
    ironTextureMaterial = new THREE.MeshPhongMaterial({
      transparent: false,
      map: ironTexture,
      shininess: 60,
      reflectivity: 0.3,
      side: THREE.DoubleSide,
    })
  }

  function updateGeometries(group) {
    group.children.forEach(x => {
      x.geometry.dispose()
      group.remove(x)
    })

    let geometry = new ExtrudedCylinderBufferGeometry(
      parameters.cylinderRadius, //data.radiusTop,
      parameters.cylinderRadius, //data.radiusBottom,
      parameters.cylinderHeight, //data.height,
      parameters.radialSegments, //data.radialSegments,
      parameters.heightSegments, //data.heightSegments,
      true, //data.openEnded,
      0, //data.thetaStart,
      2 * Math.PI, //data.thetaLength,
      parameters.cylinderExtrusion,
      imageBrightnessFunction()
    )
    geometry.translate(0.0, parameters.cylinderHeight / 2, 0.0)
    geometry.computeVertexNormals()

    let bottomDiskGeometry = new THREE.CircleBufferGeometry(
      parameters.cylinderRadius, //radius
      parameters.radialSegments //segments
    )
    bottomDiskGeometry.rotateX(Math.PI / 2)
    bottomDiskGeometry.translate(0, 0, 0)

    let topDiskGeometry = new THREE.RingBufferGeometry(
      parameters.topConeRadius,
      parameters.cylinderRadius,
      parameters.radialSegments,
      1
    )
    topDiskGeometry.rotateX(Math.PI / 2)
    topDiskGeometry.translate(0, parameters.cylinderHeight, 0)

    let topDiskCone = new THREE.ConeBufferGeometry(
      parameters.topConeRadius, //radius : Float,
      parameters.topConeHeight, //height : Float,
      parameters.radialSegments, //radialSegments : Integer,
      2, //heightSegments : Integer,
      true, //openEnded : Boolean,
      0, //thetaStart : Float,
      2 * Math.PI //thetaLength : Float)
    )
    topDiskCone.rotateX(Math.PI)
    topDiskCone.translate(
      0,
      parameters.cylinderHeight - parameters.topConeHeight / 2,
      0
    )

    let connectionGeometry = new THREE.CylinderBufferGeometry(
      parameters.connectionRadius,
      parameters.connectionRadius,
      parameters.connectionHeight,
      32,
      2,
      false,
      0,
      2 * Math.PI
    )
    connectionGeometry.translate(0.0, -parameters.connectionHeight / 2, 0)

    let gearGeometry1 = gearGeometry(
      parameters.gear1OuterRadius,
      parameters.gear1InnerRadius,
      parameters.gear1Teeth,
      {
        steps: 1,
        depth: parameters.gear1Height,
        bevelEnabled: false,
      }
    )
    gearGeometry1.rotateX(Math.PI / 2)
    gearGeometry1.translate(0.0, -parameters.connectionHeight, 0.0)
    let gear1 = new THREE.BufferGeometry().fromGeometry(gearGeometry1)

    let gearGeometry2 = gearGeometry(
      parameters.gear2OuterRadius,
      parameters.gear2InnerRadius,
      parameters.gear2Teeth,
      {
        steps: 1,
        depth: parameters.gear2Height,
        bevelEnabled: false,
      }
    )
    gearGeometry2.rotateX(Math.PI / 2)
    gearGeometry2.translate(
      0.0,
      -parameters.connectionHeight - parameters.gear1Height,
      0.0
    )
    let gear2 = new THREE.BufferGeometry().fromGeometry(gearGeometry2)

    let axisGeometry = new THREE.CylinderBufferGeometry(
      parameters.axisRadius,
      parameters.axisRadius,
      parameters.axisHeight,
      64,
      2,
      false,
      0,
      2 * Math.PI
    )
    axisGeometry.translate(0, -parameters.axisHeight / 2, 0)
    axisGeometry.translate(
      0,
      -parameters.connectionHeight -
        parameters.gear2Height -
        parameters.gear1Height,
      0
    )

    let singleGeometry = new THREE.Geometry()
    let args = [
      axisGeometry,
      connectionGeometry,
      gear1,
      gear2,
      geometry,
      topDiskGeometry,
      bottomDiskGeometry,
      topDiskCone,
    ].map(x => {
      // if (x instanceof THREE.Geometry) return x
      return new THREE.Geometry().fromBufferGeometry(x)
    })
    args.forEach(a => {
      singleGeometry.merge(a)
    })
    group.add(new THREE.Mesh(singleGeometry, iron))
    // group.add(new THREE.Mesh(axisGeometry, ironTextureMaterial))
    // group.add(new THREE.Mesh(connectionGeometry, ironTextureMaterial))
    // group.add(new THREE.Mesh(gear1, goldTextureMaterial))
    // group.add(new THREE.Mesh(gear2, bronzeTextureMaterial))
    // group.add(new THREE.Mesh(geometry, bronze))
    // group.add(new THREE.Mesh(mainCylinderGeometry, bronzeTextureMaterial))
    // group.add(new THREE.Mesh(topDiskGeometry, bronzeTextureMaterial))
    // group.add(new THREE.Mesh(bottomDiskGeometry, bronzeTextureMaterial))
    // group.add(new THREE.Mesh(topDiskCone, goldTextureMaterial))
  }

  function initialise() {
    console.log('initialise')
    initialiseMaterials()

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

    // updateGeometries(group)

    let rotationX = 0.0
    let rotationY = 0.0

    // guis.MaterialOptions(group)
    guis.CameraOptions(orbit, camera, data => {
      rotationX = -data.dx
      rotationY = -data.dy
    })
    guis.LightsOptions(lights)
    guis.GeometryOptions(parameters, group, updateGeometries)

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
