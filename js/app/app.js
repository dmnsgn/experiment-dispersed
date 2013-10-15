define([
	'dat.gui',
	'app/utils/Constant',
	'app/utils/Mouse',
	'app/utils/AudioAnalyzer',
	'app/geometries/TetrahedronGeometry',
	'app/entities/IncidentRay',
	'app/entities/Prism',
	'app/helpers/Stats',
	'app/helpers/GridHelper',
	'app/helpers/CameraHelper'
], function(GUI, Constant, Mouse, AudioAnalyzer, TetrahedronGeometry, IncidentRay, Prism, Stats, GridHelper, CameraHelper) {

	var mouse = new Mouse();

	var App = function() {

		this.constant = new Constant();

		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
		this.camera.position.x = 10;
		this.camera.position.y = 15;
		this.camera.position.z = 100;

		this.init();
		this.addLights();
		this.shadowCast();
		//this.handleAudio();

		this.createGUI();
		this.debug();

	};

	App.prototype = {

		init: function() {
			var that = this;
			var updateFcts = [];

			this.createSurface();

			// Cube Map
			this.cubeMap = new THREE.Mesh(new THREE.CubeGeometry(2000,2000,2000), new THREE.MeshBasicMaterial({
				color: '#000',
				side: THREE.DoubleSide
			}));
			this.scene.add(this.cubeMap);

			// Objects
			this.incidentRay = new IncidentRay(this.scene);
			updateFcts.push(function(delta, now) {
				this.incidentRay.update(Math.cos(now) / 5);
			}.bind(this));
			this.prism = new Prism(this.scene);

			updateFcts.push(function(delta, now) {
				// mesh.rotation.x += 1 * delta;
				// mesh.rotation.y += 2 * delta;		
			});

			// Camera update
			updateFcts.push(function(delta, now) {
				this.camera.position.x += (mouse.x * 25 - this.camera.position.x) * (delta * 3);
				//this.camera.position.y += (mouse.y * 5 - this.camera.position.y) * (delta * 3);
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
				//console.log(that.audioAnalyzer.getFrequencies());
				//log(that.audioAnalyzer.percentLoaded);
			});
		},

		createSurface: function () {

			/*var geometry	= new THREE.CubeGeometry( 1, -0.5, 1);
			var texture	= THREE.ImageUtils.loadTexture( "img/water.jpg" );
			//texture.repeat.set( 10, 10 );
			texture.repeat.set( 0.5, 0.8 );
			texture.wrapS	= texture.wrapT = THREE.RepeatWrapping;
			var material	= new THREE.MeshPhongMaterial({
				ambient		: 0xffffff,
				color		: 0xffffff,
				shininess	: 150,
				specular	: 0xffffff,
				map		: texture
			});
			var mesh		= new THREE.Mesh( geometry, material );
			mesh.scale.multiplyScalar(3);
			mesh.overdraw = true;
			mesh.position.y		= -0.5/2;
			this.scene.add( mesh );*/
		},

		addLights: function () {
			// Create the object
			var ambientLight = new THREE.AmbientLight( 0x404040 );
			var directionalLight = new THREE.DirectionalLight( 0xffffff );

			// Set cast shadow behavior
			directionalLight.position.set( 0, 1, 0 ).normalize();
			directionalLight.castShadow = true;
			directionalLight.shadowDarkness = 0.5;

			//directionalLight.shadowCameraVisible = true;

			this.scene.add(ambientLight);
			this.scene.add(directionalLight);
		},

		shadowCast: function () {
			this.renderer.shadowMapEnabled = true;

			// to antialias the shadow
			this.renderer.shadowMapSoft = true;
		},

		handleAudio: function () {
			this.audioAnalyzer = new AudioAnalyzer("sounds/What_We_Got_To_Lose_by_The_Juveniles.ogg");
		},

		createGUI: function() {
			this.gui = new dat.GUI();

			var cameraFolder = this.gui.addFolder('Camera');
			cameraFolder.add(this.camera.position, 'z', 1, 1000).name("Zoom").step("1");

			var prismFolder = this.gui.addFolder('Prism');
			prismFolder.add(this.prism.mesh.rotation, 'x', 0, 360 * M_PI/180).name("Rotation X").step("0.1");
			prismFolder.add(this.prism.mesh.rotation, 'y', 0, 360 * M_PI/180).name("Rotation Y").step("0.1");
			prismFolder.add(this.prism.mesh.rotation, 'z', 0, 360 * M_PI/180).name("Rotation Z").step("0.1");

			prismFolder.add(this.prism.mesh.position, 'x', 0, 200).name("Position X").step("1");
			prismFolder.add(this.prism.mesh.position, 'y', 0, 200).name("Position Y").step("1");
			prismFolder.add(this.prism.mesh.position, 'z', 0, 200).name("Position Z").step("1");

		},

		debug: function() {

			// Open right folder
			var e = document.createEvent('Events');
			e.initEvent("click");
			document.querySelectorAll(".dg li.title")[0].dispatchEvent(e);

			// Helpers
			var helpers = [];
			helpers.push(
				/*new THREE.GridHelper(50, 2),
				new THREE.AxisHelper(500),
				new THREE.CameraHelper(this.camera)*/
			);

			for (var i = helpers.length - 1; i >= 0; i--) {
				this.scene.add(helpers[i]);
			}

			// Perf
			var stats = new Stats();
			stats.setMode(0); // 0: fps, 1: ms

			// Align top-left
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';

			document.body.appendChild(stats.domElement);

			setInterval(function() {

				stats.begin();

				// your code goes here

				stats.end();

			}, 1000 / 60);
		}

	};

	// BG stromboscop

	return App;
});