const twoPi = Math.PI * 2
const gui = new dat.GUI()

function updateGroupGeometry(mesh, geometry) {
    if (geometry.isGeometry) {
        geometry = new THREE.BuggerGeometry().fromGeometry(geometry)
    }

    mesh.children[0].geometry.dispose()
    mesh.children[1].geometry.dispose()

    mesh.children[0].geometry = new THREE.WireframeGeometry(geometry)
    mesh.children[1].geometry = geometry
}


const guis = {
    CameraOptions: function(orbit, camera, callback) {
        let data = {
            dx: 0.0,
            dy: 0.0,
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
    },
    CylinderGeometry: function(mesh) {
        let data = {
            radiusTop: 5,
            radiusBottom: 5,
            height: 10,
            radialSegments: 24,
            heightSegments: 4,
            openEnded: false,
            thetaStart: 0,
            thetaLength: twoPi
        }

        function generate() {
            console.log('gui change')
            updateGroupGeometry(mesh,
                new THREE.CylinderBufferGeometry(
                    data.radiusTop,
					data.radiusBottom,
					data.height,
					data.radialSegments,
					data.heightSegments,
					data.openEnded,
					data.thetaStart,
					data.thetaLength
                )
            )
        }

        let folder = gui.addFolder('Cylinder Parameters')

        folder.add( data, 'radiusTop', 0, 30 ).onChange( generate );
		folder.add( data, 'radiusBottom', 0, 30 ).onChange( generate );
		folder.add( data, 'height', 1, 50 ).onChange( generate );
		folder.add( data, 'radialSegments', 3, 64 ).step( 1 ).onChange( generate );
		folder.add( data, 'heightSegments', 1, 64 ).step( 1 ).onChange( generate );
		folder.add( data, 'openEnded' ).onChange( generate );
		folder.add( data, 'thetaStart', 0, twoPi ).onChange( generate );
        folder.add( data, 'thetaLength', 0, twoPi ).onChange( generate );
        
        generate()
    }
}