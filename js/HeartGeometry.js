function HeartGeometry(
    radius = 1,
    height = 1,
) {
    THREE.BufferGeometry.call(this)

    this.type = 'HeartGeometry'

    this.parameters = {
        radius: radius,
        height: height,
    }

    let scope = this

    let indices = []
    let vertices = []
    let normals = []
    let uvs = []

    let index = 0
    let indexArray = []
    let halfHeight = height/2
    let groupStart = 0

    generate()

    this.setIndex(indices)
    this.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    this.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    this.addAttribute('uv', new THREE.Float32BufferAttribute, uvs, 2)

    function generate() {
        var x, y
        var normal = new THREE.Vector3()
        var vertex = new THREE.Vector3()

        var groupCount = 0

        // for ()
    }
}

HeartGeometry.prototype = Object.create(THREE.BufferGeometry.prototype)
HeartGeometry.prototype.constructor = HeartGeometry