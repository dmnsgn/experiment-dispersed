define(function() {

	var StoryBoard = function(app) {
		this.app = app;
	};

	StoryBoard.prototype = {
		introduction: function() {

			setInterval(function() {
				//this.app.prism.material.wireframe = Math.random() < 0.5 ? false : true;
			}, 50);

			var introTimeline = new TimelineMax({
				paused: true
			});
			introTimeline.append(new TweenMax(this.app.camera.position, 6, {
				z: 600,
				ease: Quad.easeIn
			}));
			// augmenter une light
			introTimeline.append(new TweenMax(this.app.camera.position, 6, {
				z: 200,
				ease: Quad.easeOut
			}));
			introTimeline.append(new TweenMax(this.app.camera.position, 8, {
				z: 20,
				ease: Quad.easeOut
			}));

			return introTimeline;
		},

		shake: function(offsetX, offsetY, offsetZ) {
			var tempObject = {
				x: 0,
				y: 0,
				z: 0
			};
			var shakeTween = new TweenMax(tempObject, 0.2, {
				x: offsetX || 0,
				y: offsetY || 0,
				z: offsetZ || 0,
				ease: Bounce.easeInOut,
				onUpdateParams: [tempObject, this.app.camera],
				onUpdate: function(o, camera) {
					camera.lookAt(new THREE.Vector3(o.x, o.y, o.z));
				},
				onComplete: function () {
					this.reverse();
				}
			});

			return shakeTween;
		}
	};

	return StoryBoard;
});