define(function() {

	var Prism = function(scene) {
		this.geometry = new THREE.TetrahedronGeometry(20);
		this.materials = [
			new THREE.MeshPhongMaterial({
				color: '#111',
				opacity: 1
			}),
			new THREE.MeshBasicMaterial({
				color: '#AAA',
				wireframe: true,
				transparent: true,
				opacity: 1
			})
		];
		this.mesh = new THREE.SceneUtils.createMultiMaterialObject(this.geometry, this.materials);

		// Set cast shadow behavior
		//this.mesh.castShadow = true;
		//this.mesh.receiveShadow = false;

		this.mesh.rotation.y = 90 * deg2rad;
		this.mesh.rotation.z = 120 * deg2rad;

		scene.add(this.mesh);
	};

	Prism.prototype = {
		update: function (rotationX, rotationY) {
			this.mesh.rotation.x = rotationX;
			this.mesh.rotation.y = rotationY;
		},

		coolPosition: function (rotationY) {
			this.mesh.rotation.x = 1;
			this.mesh.rotation.y = rotationY;
		}
	};

	return Prism;
});