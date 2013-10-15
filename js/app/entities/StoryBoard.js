define(function() {

	var StoryBoard = function(app) {
		this.app = app;
	};

	StoryBoard.prototype = {
		introduction: function() {

			/*setInterval(function() {
				this.app.prism.material.wireframe = Math.random() < 0.5 ? false : true;
			}, 50);*/

			var introTimeline = new TimelineLite({
				paused: true
			});
			introTimeline.append(new TweenLite(this.app.camera.position, 6, {
				z: 600,
				ease: Quad.easeIn
			}));
			// augmenter une light
			introTimeline.append(new TweenLite(this.app.camera.position, 6, {
				z: 200,
				ease: Quad.easeOut
			}));
			introTimeline.append(new TweenLite(this.app.camera.position, 8, {
				z: 0,
				ease: Quad.easeOut
			}));

			return introTimeline;
		}
	};

	return StoryBoard;
});