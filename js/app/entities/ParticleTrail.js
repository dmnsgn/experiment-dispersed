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
			var geometry = new THREE.PlaneGeometry(0.1, 100, 1, 10);
			for (var i = 0; i < this.number; i++) {

				// Color
				var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
					transparent: true,
					opacity: 0,
					color: 0xFFFFFF,
					side: THREE.DoubleSide
				}));

				// Fade In
				TweenMax.to(object.material, 1.8, {
					opacity: 1,
					delay: 0.40 * Math.random() + 1.2
				});

				object.position.z = app.camera.position.z + 100;


				// Random Rotation
				object.rotation.x = 90 * deg2rad;

				this.particles.push(object);

				object.type = that.name;
				object.angle = 0;
				object.force = ~~ (Math.random() * 20) + 1;
				object.time = ~~ (Math.random() * 20) + 1;
				object.speed = 0.001 + Math.random() * 0.0004;

				object.orbit = RADIUS * 0.5 + (RADIUS * 0.5 * Math.random());
				object.zOffset = ~~ (Math.random() * 20) + 10;

				that.scene.add(object);
			}
		},

		update: function(radius) {
			var RADIUS_SCALE = 1;
			var RADIUS_SCALE_MAX = 1.5;
			RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);

			for (var i = 0; i < this.particles.length; i++) {
				var particle = this.particles[i];

				particle.speed = 0.001 + Math.random() * 0.0004;
				particle.angle += particle.speed + app.camera.position.z * particle.speed / 10000;
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


				// Apply position
				particle.position.x = Math.cos(i + particle.angle) * (particle.orbit * RADIUS_SCALE);
				particle.position.y = Math.sin(i + particle.angle) * (particle.orbit * RADIUS_SCALE);

				particle.position.z = app.camera.position.z + particle.zOffset + Math.sin(particle.time) * particle.force;
			}
		},

		incidence: function() {
			var RADIUS_SCALE = 1;
			var RADIUS_SCALE_MAX = 1.5;
			RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);

			for (var i = 0; i < this.particles.length; i++) {

				var particle = this.particles[i];
				TweenMax.to(particle.position, 1, {
					/*x: Math.cos(i + particle.angle) * (particle.orbit * RADIUS_SCALE),
					y: Math.sin(i + particle.angle) * (particle.orbit * RADIUS_SCALE),*/
					x: 0,
					y: 0,
					z: -(app.camera.position.z + particle.zOffset + Math.sin(particle.time) * particle.force)
				});

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