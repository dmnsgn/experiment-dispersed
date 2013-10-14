define(['dat.gui', 'app/utils/Mouse', 'app/geometries/TetrahedronGeometry'], function(GUI, Mouse, TetrahedronGeometry) {

	var mouse = new Mouse();

	var App = function() {

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
		this.camera.position.z = 3;

		this.init();

		this.createGUI();

	};

	App.prototype = {

		init: function() {
			var updateFcts = [];
			this.createPrism();

			updateFcts.push(function(delta, now) {
				// mesh.rotation.x += 1 * delta;
				// mesh.rotation.y += 2 * delta;		
			});
			// Camera update
			updateFcts.push(function(delta, now) {
				this.camera.position.x += (mouse.x * 5 - this.camera.position.x) * (delta * 3);
				this.camera.position.y += (mouse.y * 5 - this.camera.position.y) * (delta * 3);
				this.camera.lookAt(this.scene.position);
			}.bind(this));

			// Render
			updateFcts.push(function() {
				this.renderer.render(this.scene, this.camera);
			}.bind(this));

			// Loop
			var lastTimeMsec = null;
			requestAnimationFrame(function animate(nowMsec) {
				// keep looping
				requestAnimationFrame(animate);
				// measure time
				lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
				var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
				lastTimeMsec = nowMsec;
				// call each update function
				updateFcts.forEach(function(updateFn) {
					updateFn(deltaMsec / 1000, nowMsec / 1000);
				});
			});
		},

		createPrism: function() {
			var geometry = new THREE.TetrahedronGeometry();
			var material = new THREE.MeshNormalMaterial();
			var mesh = new THREE.Mesh(geometry, material);
			this.prism = mesh;
			this.scene.add(mesh);
		},

		createGUI: function() {
			this.gui = new dat.GUI();

			var cameraFolder = this.gui.addFolder('Camera');
			cameraFolder.add(this.camera.position, 'z').name("Zoom").min("1").max("10").step("0.5");

		}

	};

	// BG stromboscop

	return App;
});