define(['app/app'], function() {

	var StoryBoard = function() {
		this.step = "introduction";
	};

	StoryBoard.prototype = {

		introduction: function() {
			var introTimeline = new TimelineMax({
				paused: true
			});
			introTimeline.append(new TweenMax(app.camera.position, 12, {
				z: 600,
				ease: Quad.easeIn
			}));
			// augmenter une light
			introTimeline.append(new TweenMax(app.camera.position, 5.8, {
				z: 200,
				ease: Quad.easeOut,
				onComplete: function() {
					//that.step = "showColors";
				}
			}));

			return introTimeline;
		},

		showColors: function () {
			var that = this;
			var intervalCount = 0;
			setTimeout(function () {
				var interval = setInterval(function() {
					/*this.app.prism.materials[0].opacity = (this.app.prism.materials[0].opacity == 1) ? 0 : 1;
					this.app.prism.materials[1].wireframe = false;*/
					app.prism.materials[0].color.set(app.spectrum[intervalCount]);
					app.prism.randomRotation();
					intervalCount += 1;
					if (intervalCount === 6) {
						that.incidence();
						clearInterval(interval);
						that.step = "incidence";
					}
				}, 300);
			}, 300);
		},

		incidence: function() {
			app.prism.materials[0].color.set("#111111");
			TweenMax.to(app.prism.mesh.rotation, 0.3, {
				x: 1,
				z: 0
			});
			TweenMax.to(app.prism.mesh.scale, 0.3, {
				x: 1,
				y: 1,
				z: 1,
				ease: Bounce.easeInOut
			});
			app.whiteLight.incidence();
			app.particleAssembler.createParticles();
		}
	};

	return StoryBoard;
});