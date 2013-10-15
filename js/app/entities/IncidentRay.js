define(function() {

	var IncidentRay = function(scene) {
		var texture = THREE.ImageUtils.loadTexture("img/spotLine.png");
		this.geometry = new THREE.PlaneGeometry(1, 5000, 1, 5000);

		this.geometry.computeCentroids();
		this.geometry.computeFaceNormals();
		this.geometry.computeVertexNormals();
		this.geometry.computeTangents();
		this.geometry.computeBoundingSphere();

		this.material = new THREE.MeshBasicMaterial({
			color: 0xFFFFFF,
			map: texture,
			transparent: true,
			// opacity: 0.5,
			side: THREE.DoubleSide
			// wireframe: true
			// blending: THREE.AdditiveBlending
		});

		this.material.blending = THREE["CustomBlending"];
		this.material.blendSrc = THREE["OneFactor"];
		this.material.blendDst = THREE["SrcAlphaFactor"];
		this.material.blendEquation = THREE.AddEquation;

		this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.mesh.position.set(0, 0, 60);
		this.mesh.rotation.x = 90 * deg2rad;
		scene.add(this.mesh);
	};

	IncidentRay.prototype = {
		update: function() {
			var angle = 0;
			var radius = 0.2;
			for (var i = this.geometry.vertices.length - 1; i >= 0; i--) {
				var vertex = this.geometry.vertices[i];
				angle += 0.1;
				vertex.x = Math.cos(angle) * radius - radius / 2;
				if (i % 2 === 0) {
					vertex.x += radius;
				}
			}
		}


	};

	return IncidentRay;
});