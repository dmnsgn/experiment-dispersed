define(function() {

	var ParticleTrail = function(name, scene, number) {
		this.name = name;
		this.scene = scene;
		this.number = number || 150;
		this.particles = [];
		this.verticesAngle = 0;
		this.init();
	};

	ParticleTrail.prototype = {
		init: function() {
			var RADIUS = 20;
			var that = this;
			//var geometry = new THREE.SphereGeometry(1, 20, 20);
			var geometry = new THREE.PlaneGeometry(0.1, 100, 1, 100);
			for (var i = 0; i < this.number; i++) {

				// Color
				var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
					transparent: true,
					opacity: 0,
					color: 0xFFFFFF,
					side: THREE.DoubleSide
				}));

				TweenMax.to(object.material, 1.8, {
					opacity: 1,
					delay: 0.40 * Math.random() + 1.2
				});

				//object.material.emissive.setHex(0xF00);

				// Positionning
				// object.position.x = Math.random() * 200 - 100;
				// object.position.y = Math.random() * 200 - 100;

				diffZ = 200;
				strates = 10;
				// strates = (10 * i) / that.number;
				//object.position.z = 1 * (((diffZ / 12) * strates) + 10);
				object.position.z = app.camera.position.z + 100;

				// Random circle position
				// var randomPoints = that.getRandomNumbers();
				// var x1 = randomPoints[0];
				// var x2 = randomPoints[1];
				// var x1_squared = Math.pow(x1, 2);
				// var x2_squared = Math.pow(x2, 2);

				var offsetCircle = Math.random() * 5;
				// object.position.x = offsetCircle + 30 * ((x1_squared - x2_squared) / (x1_squared + x2_squared));
				// object.position.y = offsetCircle + 30 * ((2 * x1 * x2) / (x1_squared + x2_squared));

				object.shift = {
					x: app.mouse.x,
					y: app.mouse.y
				};

				object.orbit = RADIUS * .5 + (RADIUS * .5 * Math.random());
				object.angle = 0;

				// Random Rotation
				object.rotation.x = 90 * deg2rad;
				//object.rotation.x = (Math.random() * 360) * deg2rad;
				//object.rotation.y = (Math.random() * 360) * deg2rad;
				//object.rotation.z = (Math.random() * 360) * deg2rad;

				this.particles.push(object);

				object.type = that.name;
				object.zOffset = ~~(Math.random() * 20) + 1;
				object.time = ~~(Math.random() * 20) + 1;
				object.force = ~~(Math.random() * 50) + 1;
				object.speed = 0.001 + Math.random() * 0.0004;

				that.scene.add(object);
			}
		},

		update: function(radius) {
			var RADIUS_SCALE = 1;
			var RADIUS_SCALE_MAX = 1.5;
			RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);

			for (var i = 0; i < this.particles.length; i++) {
				var particle = this.particles[i];

				particle.angle += particle.speed;
				particle.time += particle.speed * 5;


				/*for (var j = particle.geometry.vertices.length - 1; j >= 0; j--) {
					var vertex = particle.geometry.vertices[j];
					this.verticesAngle += 0.1;
					vertex.x = Math.cos(this.verticesAngle) * radius - radius / 2 + vertex.randomOffset;
					if (j%2 === 0) {
						vertex.x += radius;
					}
					particle.geometry.verticesNeedUpdate = true;
				}
*/

				particle.shift.x += (app.mouse.x - particle.shift.x) * (particle.speed);
				particle.shift.y += (app.mouse.y - particle.shift.y) * (particle.speed);

				// Apply position
				particle.position.x = particle.shift.x + Math.cos(i + particle.angle) * (particle.orbit * RADIUS_SCALE);
				particle.position.y = particle.shift.y + Math.sin(i + particle.angle) * (particle.orbit * RADIUS_SCALE);
				//particle.position.z = app.camera.position.z + Math.sin(i + particle.zOffset);

				particle.position.z = app.camera.position.z + 10 + particle.zOffset + Math.sin(particle.time) * particle.force;
			}
		},

		getRandomNumbers: function() {
			var x1 = Math.random() * 2 - 1;
			var x2 = Math.random() * 2 - 1;
			if ((Math.pow(x1, 2) + Math.pow(x2, 2)) < 1) {
				return [x1, x2];
			} else {
				return this.getRandomNumbers();
			}
		}
	};

	return ParticleTrail;
});