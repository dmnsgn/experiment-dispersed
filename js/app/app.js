define([
	'dat.gui',
	'app/utils/Constant',
	'app/utils/Mouse',
	'app/utils/Resize',
	'app/utils/AudioAnalyzer',
	'app/geometries/TetrahedronGeometry',
	'app/entities/StoryBoard',
	'app/entities/ParticleTrail',
	'app/entities/IncidentRay',
	'app/entities/Prism',
	'app/helpers/Stats',
	'app/helpers/GridHelper',
	'app/helpers/CameraHelper'
], function(GUI, Constant, Mouse, Resize, AudioAnalyzer, TetrahedronGeometry, StoryBoard, ParticleTrail, IncidentRay, Prism, Stats, GridHelper, CameraHelper) {


	var App = function() {

		this.constant = new Constant();
		this.mouse = new Mouse();
		this.storyBoard = new StoryBoard(this);
		this.spectrum = [0x760CDD, 0x00B0F1, 0x00F1C3, 0x92D14E, 0xFFC000, 0xF3FF00, 0xDD6008, 0x111111];

		// Pitetre créer ça plus tard
		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById('canvas').appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
		this.camera.position.x = 10;
		//this.camera.position.y = 15;
		this.camera.position.z = 1000;
		this.camera.lookAt(this.scene.position);
		this.camera.shakeForce = 0;

		var resize = new Resize(this.renderer, this.camera);

		this.setupAudio();

	};

	App.prototype = {

		setupAudio: function() {
			var that = this;
			var loader = document.getElementById("loader");
			var logo = document.getElementById("logo");
			var count = document.getElementById("count");

			this.audioAnalyzer = new AudioAnalyzer("sounds/What_We_Got_To_Lose_by_The_Juveniles.ogg");
			var interval = setInterval(function() {
				count.innerText = ~~ (that.audioAnalyzer.percentLoaded) + '%'
				if (that.audioAnalyzer.percentLoaded == 100) {
					clearInterval(interval);

					// Remove loader
					if (loader.parentNode) {
						loader.parentNode.removeChild(logo);
						loader.parentNode.removeChild(loader);
					}

					// Init scene
					that.audioAnalyzer.changeVolume(0);
					that.init();

					setTimeout(function() {
						that.handleAudio();
					}, 1000);
				}
			}, 1);
		},

		init: function() {
			var that = this;
			this.updatedFunctions = [];

			this.addLights();
			this.shadowCast();

			this.createSurface();
			this.createParticles();

			// Cube Map
			var texture = THREE.ImageUtils.loadTexture("img/2.jpg");
			this.cubeMap = new THREE.Mesh(new THREE.CubeGeometry(2000, 2000, 2000), new THREE.MeshBasicMaterial({
				color: 0xFFFFFF,
				map: texture,
				side: THREE.BackSide
			}));
			this.scene.add(this.cubeMap);

			// Objects
			/*this.incidentRay = new IncidentRay(this.scene);
			this.updatedFunctions.push(function(delta, now) {
				this.incidentRay.update(Math.cos(now) / 2);
				this.incidentRay.position(this.camera.position.z);
			}.bind(this));*/
			this.whiteLight = new ParticleTrail("whitelight", this.scene, 30);

			this.prism = new Prism(this.scene);

			this.updatedFunctions.push(function(delta, now) {
				that.update(delta, now);
			});

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
				that.updatedFunctions.forEach(function(updateFn) {
					updateFn(deltaMsec / 1000, nowMsec / 1000);
				});

			});

			/*setTimeout(function () {
				debugger;
			}, 3000);
*/
			this.createGUI();
			this.debug();
		},

		update: function(delta, now) {


			if (app.storyBoard.step == "introduction") {
				this.whiteLight.update(Math.cos(now) / 2);
				this.prism.update(Math.sin(now) / 20, Math.cos(now) / 10);
			} else if (app.storyBoard.step == "incidence") {
				this.prism.coolPosition(Math.cos(now) / 10);
			}

			// Camera update
			//this.camera.position.x += (this.mouse.x * 25 - this.camera.position.x) * (delta * 3);
			this.camera.position.x = 0 + this.camera.shakeForce * 2 * Math.random() - this.camera.shakeForce;
			this.camera.position.y = 0 + this.camera.shakeForce * 2 * Math.random() - this.camera.shakeForce;

			// Render
			this.renderer.render(this.scene, this.camera);
		},

		handleAudio: function() {
			this.storyBoard.introduction().play();

			this.updatedFunctions.push(function() {

				switch (this.storyBoard.step) {
					// Handle drum kick
					case "introduction":
						if (this.audioAnalyzer.getAverageFrequencies() > 110) {
							this.camera.shakeForce = (this.audioAnalyzer.getAverageFrequencies() - 110) * 3;
							TweenMax.to(this.camera, 0.5, {
								shakeForce: 0
							});
						}
						break;
					case "incidence":
						// do things
						break;
					default:
						log("Ooops ! Out of switch");
				}
			}.bind(this));
		},

		createParticles: function() {
			this.engine = new ParticleEngine(this.scene);
			this.engine.setValues(Examples.smoke);
			this.engine.initialize();

			this.updatedFunctions.push(function (delta, now) {
				this.engine.update( delta * 0.5 ); 
			}.bind(this));
		},

		createSurface: function() {

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

		addLights: function() {
			// Create the object
			var ambientLight = new THREE.AmbientLight(0x888888);
			var directionalLight = new THREE.DirectionalLight(0x404040);

			// Set cast shadow behavior
			directionalLight.position.set(0, 1, 0).normalize();
			directionalLight.castShadow = true;
			directionalLight.shadowDarkness = 0.5;

			//directionalLight.shadowCameraVisible = true;

			this.scene.add(ambientLight);
			this.scene.add(directionalLight);
		},

		shadowCast: function() {
			this.renderer.shadowMapEnabled = true;

			// to antialias the shadow
			this.renderer.shadowMapSoft = true;
		},

		createGUI: function() {
			this.gui = new dat.GUI();

			var cameraFolder = this.gui.addFolder('Camera');
			cameraFolder.add(this.camera.position, 'z', 1, 1500).name("Zoom").step("1");

			var prismFolder = this.gui.addFolder('Prism');
			prismFolder.add(this.prism.mesh.rotation, 'x', 0, 360 * M_PI / 180).name("Rotation X").step("0.1");
			prismFolder.add(this.prism.mesh.rotation, 'y', 0, 360 * M_PI / 180).name("Rotation Y").step("0.1");
			prismFolder.add(this.prism.mesh.rotation, 'z', 0, 360 * M_PI / 180).name("Rotation Z").step("0.1");

			prismFolder.add(this.prism.mesh.position, 'x', 0, 200).name("Position X").step("1");
			prismFolder.add(this.prism.mesh.position, 'y', 0, 200).name("Position Y").step("1");
			prismFolder.add(this.prism.mesh.position, 'z', 0, 200).name("Position Z").step("1");

			/*var whiteLightFolder = this.gui.addFolder('White Light');
			whiteLightFolder.add(this.incidentRay.mesh.position, 'x', -2500, 2500).name("Position X").step("1");
			whiteLightFolder.add(this.incidentRay.mesh.position, 'y', -2500, 2500).name("Position Y").step("1");
			whiteLightFolder.add(this.incidentRay.mesh.position, 'z', -2500, 2500).name("Position Z").step("1");*/

		},

		debug: function() {

			// Open right folder
			var e = document.createEvent('Events');
			e.initEvent("click");
			var folders = document.querySelectorAll(".dg li.title");
			for (var i = 0, len = folders.length; i < len; i++) {
				folders[i].dispatchEvent(e);
			}

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
		},

		distanceBetween: function(p1, p2) {
			var dx = p2.x - p1.x;
			var dy = p2.y - p1.y;
			return Math.sqrt(dx * dx + dy * dy);
		}

	};

	// BG stromboscop

	return App;
});