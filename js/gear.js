function gearShape(outerRadius = 1, innerRadius = 0.6, teeth = 8) {
  let shape = new THREE.Shape()

  const TWO_PI = Math.PI * 2
  let toothAngle = TWO_PI / teeth
  // let quarterToothAngle = toothAngle / 4
  let theta = 0.0
  let index = 0

  shape.moveTo(innerRadius, 0)

  do {
    shape.lineTo(
      (1.0 * innerRadius + 0.0 * outerRadius) *
        Math.cos(theta + (1 * toothAngle) / 8),
      (1.0 * innerRadius + 0.0 * outerRadius) *
        Math.sin(theta + (1 * toothAngle) / 8)
    )
    shape.lineTo(
      (0.8 * innerRadius + 0.2 * outerRadius) *
        Math.cos(theta + (2 * toothAngle) / 8),
      (0.8 * innerRadius + 0.2 * outerRadius) *
        Math.sin(theta + (2 * toothAngle) / 8)
    )
    shape.lineTo(
      (0.2 * innerRadius + 0.8 * outerRadius) *
        Math.cos(theta + (3.25 * toothAngle) / 8),
      (0.2 * innerRadius + 0.8 * outerRadius) *
        Math.sin(theta + (3.25 * toothAngle) / 8)
    )
    shape.lineTo(
      (0.0 * innerRadius + 1.0 * outerRadius) *
        Math.cos(theta + (4.25 * toothAngle) / 8),
      (0.0 * innerRadius + 1.0 * outerRadius) *
        Math.sin(theta + (4.25 * toothAngle) / 8)
    )
    shape.lineTo(
      (0.0 * innerRadius + 1.0 * outerRadius) *
        Math.cos(theta + (4.75 * toothAngle) / 8),
      (0.0 * innerRadius + 1.0 * outerRadius) *
        Math.sin(theta + (4.75 * toothAngle) / 8)
    )
    shape.lineTo(
      (0.2 * innerRadius + 0.8 * outerRadius) *
        Math.cos(theta + (5.75 * toothAngle) / 8),
      (0.2 * innerRadius + 0.8 * outerRadius) *
        Math.sin(theta + (5.75 * toothAngle) / 8)
    )
    shape.lineTo(
      (0.8 * innerRadius + 0.2 * outerRadius) *
        Math.cos(theta + (7 * toothAngle) / 8),
      (0.8 * innerRadius + 0.2 * outerRadius) *
        Math.sin(theta + (7 * toothAngle) / 8)
    )
    shape.lineTo(
      (1.0 * innerRadius + 0.0 * outerRadius) *
        Math.cos(theta + (8 * toothAngle) / 8),
      (1.0 * innerRadius + 0.0 * outerRadius) *
        Math.sin(theta + (8 * toothAngle) / 8)
    )
    theta += toothAngle
    index++
  } while (index < teeth)

  shape.lineTo(innerRadius, 0)

  return shape
}

function gearGeometry(outerRadius, innerRadius, teeth, extrudeSettings) {
  extrudeSettings = extrudeSettings || {
    steps: 1,
    depth: 0.1, //THickness
    bevelEnabled: false,
    bevelThickness: 1,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 1,
  }

  let shape = gearShape(outerRadius, innerRadius, teeth)
  let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  return geometry
}
