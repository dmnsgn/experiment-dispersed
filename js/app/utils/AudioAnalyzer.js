define(function() {

	/**
	 * AudioAnalyzer
	 *
	 * @author Damien SEGUIN
	 * @param {audiofile} file [the audio file to process]
	 */
	var AudioAnalyzer = function(file) {
		this.createContext();
		this.percentLoaded = 0;
		this.setupAudioNodes();
		this.setupVolume();
		this.loadSound(file);
	};

	AudioAnalyzer.prototype = {
		createContext: function() {
			var hasWebkitAudio = typeof(webkitAudioContext) === "function";
			if (hasWebkitAudio) {
				this.ctx = new webkitAudioContext();
				this.audioBuffer;
				this.sourceNode;
				this.gainNode;
			} else {
				alert("Your browser doesn't support Web Audio API, use latest Chrome version!");
			}
		},
		setupAudioNodes: function() {


			// setup a javascript node
			this.javascriptNode = this.ctx.createJavaScriptNode(2048, 1, 1);
			// connect to destination, else it isn't called
			this.javascriptNode.connect(this.ctx.destination);

			// setup an analyser
			this.analyser = this.ctx.createAnalyser();
			this.analyser.smoothingTimeConstant = 0.3;
			this.analyser.fftSize = 512;

			// create a buffer source node
			this.sourceNode = this.ctx.createBufferSource();
			this.sourceNode.connect(this.analyser);
			this.analyser.connect(this.javascriptNode);

			// create a buffer source node
			//this.sourceNode = this.ctx.createBufferSource();
			// connect it to context destination
			this.sourceNode.connect(this.ctx.destination);

		},
		setupVolume: function() {
			// Create a gain node.
			this.gainNode = this.ctx.createGain();
			// Connect the source to the gain node.
			this.sourceNode.connect(this.gainNode);
			// Connect the gain node to the destination.
			this.gainNode.connect(this.ctx.destination);
		},
		changeVolume: function(volume) {
			this.gainNode.gain.value = volume;
		},
		loadSound: function(file) {
			var self = this;

			var request = new XMLHttpRequest();
			request.open('GET', file, true);
			request.responseType = 'arraybuffer';

			request.onprogress = this.onProgress.bind(this);

			request.onload = function() {
				// decode the data
				self.ctx.decodeAudioData(request.response, function(buffer) {
					// when the audio is decoded play the sound
					console.log("AudioDecoded", buffer);
					self.play(buffer);
				}, self.onError);
			};
			request.send();
		},
		play: function(buffer) {
			this.sourceNode.buffer = buffer;
			this.sourceNode.noteOn(0);

			this.javascriptNode.onaudioprocess = this.getFrequencies.bind(this);
		},
		getFrequencies: function(e) {

			// get the average for the first channel
			var frequencies = new Uint8Array(this.analyser.frequencyBinCount);
			this.analyser.getByteFrequencyData(frequencies);

			return frequencies;
		},

		getAverageFrequencies: function() {
			var values = 0;
			var average;

			var length = this.getFrequencies().length;

			// get all the frequency amplitudes
			for (var i = 0; i < length; i++) {
				values += this.getFrequencies()[i];
			}

			average = values / length;
			return average;
		},

		onProgress: function(e) {
			var percentComplete = (e.position / e.totalSize) * 100;

			this.percentLoaded = percentComplete;
		},
		onError: function(e) {
			console.log(e);
		}

	};

	return AudioAnalyzer;
});