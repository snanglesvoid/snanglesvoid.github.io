function MusicBoxCylinderGeometry(
  radius = 1,
  height = 3,
  radialSegments = 128,
  heightSegments = 128,
  extrusion = 0.2
) {
  THREE.BufferGeometry.call(this)

  this.type = 'MusicBoxCylinderGeometry'

  if (radius <= 0) {
    console.warn('negative radius! set to 1')
    radius = 1
  }
  if (radialSegments < 3) {
    console.warn('too few radial segments! defaults to 3')
    radialSegments = 3
  }
  if (heightSegments < 1) {
    console.warn('too few height segments! defaults to 1')
  }

  this.parameters = {
    radius: radius,
    height: height,
    radialSegments: radialSegments,
    heightSegments: heightSegments,
    extrusion: extrusion,
  }

  const TWOPI = Math.PI * 2

  let index = 0

  let indices = []
  let vertices = []
  let normals = []
  let uvs = []
}

MusicBoxCylinderGeometry.prototype = Object.create(
  THREE.BufferGeometry.prototype
)
MusicBoxCylinderGeometry.prototype.constructor = MusicBoxCylinderGeometry

let params = {
  cylinderHeight: 41.2,
  cylinderRadius: 23.1,
  heightPadding: 2.5,
  gearPadding: 1.5,
  innerGearWidth: 1.1,
  innerGearTeeth: 96,
  innerGearTeethDepth: 1,
  outerGearTeeth: 18,
  outerGearWidth: 2.1,
  outerGearTeethDepth: 1.8,
  axisWidth: 1,
  axisRadius: 2.1,
  coneDepth: 1,
  coneRadius: 1,
}
