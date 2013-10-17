define(function() {

	var StoryBoard = function() {
		this.step = "introduction";
	};

	StoryBoard.prototype = {

		introduction: function() {

			var that = this;

	

			var introTimeline = new TimelineMax({
				paused: true
			});
			introTimeline.append(new TweenMax(app.camera.position, /*12*/2, {
				z: 600,
				ease: Quad.easeIn
			}));
			// augmenter une light
			introTimeline.append(new TweenMax(app.camera.position, /*6*/1, {
				z: 200,
				ease: Quad.easeOut,
				onComplete: function() {
					log("on intro complete")
					TweenMax.to(app.prism.mesh.rotation, 0.5, {
						x: 1,
						z: 0
					});
					var intervalCount = 0;
					var interval = setInterval(function() {
						/*this.app.prism.materials[0].opacity = (this.app.prism.materials[0].opacity == 1) ? 0 : 1;
						this.app.prism.materials[1].wireframe = false;*/
						app.prism.materials[0].color.setHex(app.spectrum[intervalCount]);
						app.prism.materials[0].emissive.setHex(app.spectrum[intervalCount]);
						intervalCount += 1;
						if (intervalCount === 8) {
							clearInterval(interval);
							that.step = "incidence";
							that.incidence();
						}
					}, 600 / 2);
				}
			}));

			return introTimeline;
		},

		incidence: function() {
			//app.prism.materials[0].wireframe = Math.random() < 0.5 ? false : true;
			app.whiteLight.incidence();
			
		}
	};

	return StoryBoard;
});