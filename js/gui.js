const twoPi = Math.PI * 2
const gui = new dat.GUI()

window.sin = Math.sin
window.cos = Math.cos
window.exp = Math.exp
window.PI = Math.PI

window.extrusionFunction = (x, y) => 1

function updateGroupGeometry(mesh, geometry) {
  if (geometry.isGeometry) {
    geometry = new THREE.BufferGeometry().fromGeometry(geometry)
  }
  geometry.computeVertexNormals()

  mesh.children[0].geometry.dispose()
  mesh.children[1].geometry.dispose()

  mesh.children[0].geometry = new THREE.WireframeGeometry(geometry)
  mesh.children[1].geometry = geometry
}

const guis = {
  CameraOptions: function(orbit, camera, callback) {
    let data = {
      dx: 0.0,
      dy: 0.004,
      enableZoom: true,
    }

    function update() {
      orbit.enableZoom = data.enableZoom
      if (callback) callback(data)
    }

    let folder = gui.addFolder('Camera Options')

    folder
      .add(data, 'dx', -0.05, 0.05)
      .step(0.005)
      .onChange(update)
    folder
      .add(data, 'dy', -0.05, 0.05)
      .step(0.005)
      .onChange(update)
    folder.add(data, 'enableZoom').onChange(update)

    update()
  },
  LightsOptions: function(lights) {
    let data = {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
    }
    let positions = lights.map(l => {
      return {
        x: l.position.x,
        y: l.position.y,
        z: l.position.z,
      }
    })
    let update = () => {
      lights.forEach((l, i) => {
        let sinz = Math.sin(data.rotationZ)
        let cosz = Math.cos(data.rotationZ)
        let siny = Math.sin(data.rotationY)
        let cosy = Math.cos(data.rotationY)
        let sinx = Math.sin(data.rotationX)
        let cosx = Math.cos(data.rotationX)

        let pos = positions[i]
        l.position.x = pos.x * cosz - pos.y * sinz
        l.position.y = pos.x * sinz + pos.y * cosz
        l.position.z = pos.z
        pos = { x: l.position.x, y: l.position.y, z: l.position.z }
        l.position.x = pos.x * cosy + pos.z * siny
        l.position.y = pos.y
        l.position.z = -pos.x * siny + pos.z * cosy
        pos = { x: l.position.x, y: l.position.y, z: l.position.z }
        l.position.x = pos.x
        l.position.y = pos.y * cosx - pos.z * sinx
        l.position.z = pos.y * sinx + pos.z * cosx
      })
    }
    let folder = gui.addFolder('Light Options')
    folder
      .add(data, 'rotationX', 0, 2 * Math.PI)
      .step(0.05)
      .onChange(update)
    folder
      .add(data, 'rotationY', 0, 2 * Math.PI)
      .step(0.05)
      .onChange(update)
    folder
      .add(data, 'rotationZ', 0, 2 * Math.PI)
      .step(0.05)
      .onChange(update)
    // lights.forEach((light, index) => {
    // data[`light_${index + 1}_x`] = light.position.x
    // data[`light_${index + 1}_y`] = light.position.y
    // data[`light_${index + 1}_z`] = light.position.z

    // folder
    //   .add(data, `light_${index + 1}_x`, -400, 400)
    //   .step(1)
    //   .onChange(() => {
    //     light.position.x = data[`light_${index + 1}_x`]
    //   })
    // folder
    //   .add(data, `light_${index + 1}_y`, -400, 400)
    //   .step(1)
    //   .onChange(() => {
    //     light.position.x = data[`light_${index + 1}_y`]
    //   })
    // folder
    //   .add(data, `light_${index + 1}_z`, -400, 400)
    //   .step(1)
    //   .onChange(() => {
    //     light.position.x = data[`light_${index + 1}_z`]
    //   })
    // })
  },
  MaterialOptions: function(mesh) {
    let data = {
      lineColor: '0xffffff',
      lineOpacity: 0.0,
      meshColor: '0xcd7f32', //'0x156289',
      meshEmissive: '0x673811', //'0x072534',
      meshSpecular: '0x673811',
      flatShading: false,
      shininess: 100,
      reflectivity: 0,
    }

    function update() {
      let lineMaterial = new THREE.LineBasicMaterial({
        color: +data.lineColor || 0xffffff,
        transparent: true,
        opacity: data.lineOpacity,
      })
      let meshMaterial = new THREE.MeshPhongMaterial({
        color: +data.meshColor || 0x156289,
        emissive: +data.meshEmissive || 0x072534,
        side: THREE.DoubleSide,
        flatShading: data.flatShading,
        specular: +data.meshSpecular,
        shininess: data.shininess,
        reflectivity: data.reflectivity,
      })
      mesh.children[0].material = lineMaterial
      mesh.children[1].material = meshMaterial
      if (mesh.children[2]) {
        console.log('update text')
        mesh.children[2].material = meshMaterial
      }
    }

    let folder = gui.addFolder('Material Options')

    folder.add(data, 'lineColor').onChange(update)
    folder.add(data, 'lineOpacity', 0, 1).onChange(update)
    folder.add(data, 'meshColor').onChange(update)
    folder.add(data, 'meshEmissive').onChange(update)
    folder.add(data, 'meshSpecular').onChange(update)
    folder.add(data, 'flatShading').onChange(update)
    folder.add(data, 'shininess', 0, 100).onChange(update)
    folder.add(data, 'reflectivity', 0, 1).onChange(update)

    update()
  },
  CylinderGeometry: function(
    mesh,
    radiusTop = 5,
    radiusBottom = 5,
    height = 10,
    extrusion = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0
  ) {
    let data = {
      radiusTop: radiusTop,
      radiusBottom: radiusBottom,
      height: height,
      radialSegments: 64,
      heightSegments: 64,
      openEnded: false,
      thetaStart: 0,
      thetaLength: twoPi,
      extrusion: extrusion,
      extrusionFunction: 'cos(2*PI*y)',
      rotateX: rotateX,
      rotateY: rotateY,
      rotateZ: rotateZ,
    }

    function generate() {
      let geo = new ExtrudedCylinderBufferGeometry(
        data.radiusTop,
        data.radiusBottom,
        data.height,
        data.radialSegments,
        data.heightSegments,
        data.openEnded,
        data.thetaStart,
        data.thetaLength,
        data.extrusion,
        (x, y) => window.extrusionFunction(x, y)
      )
      geo.rotateX(data.rotateX)
      geo.rotateY(data.rotateY)
      geo.rotateZ(data.rotateZ)
      geo.translate(0, -4, 0)
      updateGroupGeometry(mesh, geo)
    }

    let folder = gui.addFolder('Cylinder Parameters')

    folder.add(data, 'radiusTop', 0, 30).onChange(generate)
    folder.add(data, 'radiusBottom', 0, 30).onChange(generate)
    folder.add(data, 'height', 1, 50).onChange(generate)
    folder
      .add(data, 'radialSegments', 3, 128)
      .step(1)
      .onChange(generate)
    folder
      .add(data, 'heightSegments', 1, 128)
      .step(1)
      .onChange(generate)
    folder.add(data, 'openEnded').onChange(generate)
    folder.add(data, 'thetaStart', 0, twoPi).onChange(generate)
    folder.add(data, 'thetaLength', 0, twoPi).onChange(generate)
    folder.add(data, 'rotateX', 0, twoPi).onChange(generate)
    folder.add(data, 'rotateY', 0, twoPi).onChange(generate)
    folder.add(data, 'rotateZ', 0, twoPi).onChange(generate)
    folder.add(data, 'extrusion', 0, 4).onChange(generate)
    folder.add(data, 'extrusionFunction').onChange(generate)

    generate()

    return function(d) {
      Object.keys(d).forEach(k => {
        data[k] = d[k]
      })
      generate()
    }
  },
  GeometryOptions: function(parameters, group, callback) {
    let folder = gui.addFolder('Geometry Options')

    let cylinderFolder = folder.addFolder('Cylinder Options')
    cylinderFolder.add(parameters, 'radialSegments', 8, 320).step(1)
    cylinderFolder.add(parameters, 'heightSegments', 8, 320).step(1)
    cylinderFolder.add(parameters, 'cylinderRadius', 4, 50).step(0.01)
    cylinderFolder.add(parameters, 'cylinderHeight', 10, 100).step(0.01)
    cylinderFolder.add(parameters, 'cylinderExtrusion', -20, 30).step(0.01)
    cylinderFolder.add(parameters, 'topConeRadius', 0, 10).step(0.01)
    cylinderFolder.add(parameters, 'topConeHeight', 0, 10).step(0.01)

    let gearFolder = folder.addFolder('Gear Options')
    gearFolder.add(parameters, 'gear1Height', 0, 10).step(0.01)
    gearFolder.add(parameters, 'gear1InnerRadius', 0.5, 19).step(0.01)
    gearFolder.add(parameters, 'gear1OuterRadius', 1, 20).step(0.01)
    gearFolder.add(parameters, 'gear1Teeth', 3, 128).step(1)

    gearFolder.add(parameters, 'gear2Height', 0, 10).step(0.01)
    gearFolder.add(parameters, 'gear2InnerRadius', 0.5, 19).step(0.01)
    gearFolder.add(parameters, 'gear2OuterRadius', 1, 20).step(0.01)
    gearFolder.add(parameters, 'gear2Teeth', 3, 128).step(1)

    let axisFolder = folder.addFolder('Axis Options')
    axisFolder.add(parameters, 'connectionHeight', 0, 20).step(0.01)
    axisFolder.add(parameters, 'connectionRadius', 1, 10).step(0.01)
    axisFolder.add(parameters, 'axisHeight', 0, 10).step(0.01)
    axisFolder.add(parameters, 'axisRadius', 1, 10).step(0.01)

    folder
      .add(parameters, 'refresh', 0, 1)
      .step(1)
      .onChange(_ => {
        callback(group)
      })
  },
}
