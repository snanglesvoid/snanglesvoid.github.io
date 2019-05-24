const twoPi = Math.PI * 2
const gui = new dat.GUI()

window.sin = Math.sin
window.cos = Math.cos
window.exp = Math.exp
window.PI = Math.PI

window.extrusionFunction = (x,y) => 1

function updateGroupGeometry(mesh, geometry) {
    if (geometry.isGeometry) {
        geometry = new THREE.BufferGeometry().fromGeometry(geometry)
    }

    mesh.children[0].geometry.dispose()
    mesh.children[1].geometry.dispose()

    mesh.children[0].geometry = new THREE.WireframeGeometry(geometry)
    mesh.children[1].geometry = geometry

}



const guis = {
    CameraOptions: function(orbit, camera, callback) {
        let data = {
            dx: 0.005,
            dy: 0.004,
            enableZoom: true
        }

        function update() {
            orbit.enableZoom = data.enableZoom
            if (callback) callback(data)
        }

        let folder = gui.addFolder('Camera Options')

        folder.add(data, 'dx', 0, 0.02).onChange(update)
        folder.add(data, 'dy', 0, 0.02).onChange(update)
        folder.add(data, 'enableZoom').onChange(update)

        update()
    },
    LightsOptions: function(lights) {
        let data = {
        }

        let folder = gui.addFolder('Light Options')

        lights.forEach((light, index) => {
            data[`light_${index+1}_x`] = light.position.x
            data[`light_${index+1}_y`] = light.position.y
            data[`light_${index+1}_z`] = light.position.z

            folder.add(data, `light_${index + 1}_x`, -400, 400).step(1).onChange(() => {
                light.position.x = data[`light_${index + 1}_x`]
            })
            folder.add(data, `light_${index + 1}_y`, -400, 400).step(1).onChange(() => {
                light.position.x = data[`light_${index + 1}_y`]
            })
            folder.add(data, `light_${index + 1}_z`, -400, 400).step(1).onChange(() => {
                light.position.x = data[`light_${index + 1}_z`]
            })
        })


    },
    MaterialOptions: function(mesh) {
        let data = {
            lineColor: '0xffffff',
            lineOpacity: 0.0,
            meshColor: '0xf81183',//'0x156289',
            meshEmissive: '0x660634',//'0x072534',
            flatShading: true,
        }

        function update() {
            let lineMaterial = new THREE.LineBasicMaterial({
                color: +(data.lineColor) || 0xffffff,
                transparent: true,
                opacity: data.lineOpacity
            })
            let meshMaterial = new THREE.MeshPhongMaterial({
                color: +(data.meshColor) || 0x156289,
                emissive: +(data.meshEmissive) || 0x072534,
                side: THREE.DoubleSide,
                flatShading: data.flatShading
            })
            mesh.children[0].material = lineMaterial
            mesh.children[1].material = meshMaterial
            if (mesh.children[2]) {
                console.log('update text')
                mesh.children[2].material = meshMaterial
            }
        }

        let folder = gui.addFolder("Material Options")

        folder.add(data, 'lineColor').onChange(update)
        folder.add(data, 'lineOpacity', 0, 1).onChange(update)
        folder.add(data, 'meshColor').onChange(update)
        folder.add(data, 'meshEmissive').onChange(update)
        folder.add(data, 'flatShading').onChange(update)

        update()
    },
    CylinderGeometry: function(mesh,
            radiusTop = 5,
            radiusBottom = 5,
            height = 10,
            extrusion = 0,
            rotateX = 0,
            rotateY = 0,
            rotateZ = 0,
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
            extrusionFunction: "cos(2*PI*y)",
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
                (x, y) => window.extrusionFunction(x,y)
            )
            geo.rotateX(data.rotateX)
            geo.rotateY(data.rotateY)
            geo.rotateZ(data.rotateZ)
            geo.translate(0,-4, 0);
            updateGroupGeometry(mesh,geo)
        }

        let folder = gui.addFolder('Cylinder Parameters')

        folder.add( data, 'radiusTop', 0, 30 ).onChange( generate );
		folder.add( data, 'radiusBottom', 0, 30 ).onChange( generate );
		folder.add( data, 'height', 1, 50 ).onChange( generate );
		folder.add( data, 'radialSegments', 3, 128 ).step( 1 ).onChange( generate );
		folder.add( data, 'heightSegments', 1, 128 ).step( 1 ).onChange( generate );
		folder.add( data, 'openEnded' ).onChange( generate );
		folder.add( data, 'thetaStart', 0, twoPi ).onChange( generate );
        folder.add( data, 'thetaLength', 0, twoPi ).onChange( generate );
        folder.add( data, 'rotateX', 0, twoPi ).onChange( generate );
        folder.add( data, 'rotateY', 0, twoPi ).onChange( generate );
        folder.add( data, 'rotateZ', 0, twoPi ).onChange( generate );
        folder.add( data, 'extrusion', 0, 4).onChange( generate );
        folder.add( data, 'extrusionFunction').onChange( generate );
        
        generate()
    }
}