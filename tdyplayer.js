	var VideoPlayer = function(){
		var youtubeApiScript = "//www.youtube.com/iframe_api";
		var youtubeUrl = '//www.youtube.com/embed/';
		var vimeoApiScript = "//secure-a.vimeocdn.com/js/froogaloop2.min.js";
		var vimeoUrl = '//player.vimeo.com/video/';
		var self;
		var init_cb;
		var vimeoIsPlaying = false;
		var vimeoIsFinished = false;
		// Default Optioins:
		this.options = {
				parent: undefined,
				type: undefined,
				video_id : undefined,
				iframe_id: 'video_iframe',
				frameborder: 0,
				scrolling: 'no',
				width: "100%",
				height: "100%",
				volume: 0,
				settings: {
					autoplay: 0,
					loop: 0,
					fullscreen: 1,
					vq: '720',
				},
				events: {
					ready: undefined,
					play: undefined,
					pause: undefined,
					finish: undefined
				},
		}

		this.init = function(args, cb){
			// Set reference to our object:
			self = this;
			//  Set our final callback
			init_cb = cb;
			// Set our video player options:
			_setupOptions(args.options, _setup)
		};

		var _setupOptions = function(options, cb){
			//  Check to make sure a type was passed in:
			if(!options.type){
				throw "Your must pass an a video type" 
			}
			//  Check for Iframe ID
			if(!options.iframe_id){
				throw "Your must pass an iframe_id" 
			}
			//  Map our options to defaults:
			Object.keys(options).forEach(function (key) {
				self.options[key] =  options[key];
			});


			// If you pass a jquery object for the parent, we get the dom element:
			if(self.options.parent.length){
				self.options.parent = self.options.parent[0]
			}

			if(typeof cb === "function"){
				cb();
			}
		}

		this.isPlaying = function(cb){
			if(self.options.type === "vimeo"){
				if(typeof cb === 'function'){ cb(vimeoIsPlaying); } else{ return vimeoIsPlaying; }
			}
			else if(self.options.type === "youtube"){
				var isPlaying;
				var state = this.player.getPlayerState();
				if(state === 1){ isPlaying = true; } else{ isPlaying = false; }
				if(typeof cb === 'function'){ cb(vimeoIsPlaying); } else{ return vimeoIsPlaying; }
			}
		}

		this.isPaused = function(cb){
			if(self.options.type === "vimeo"){
				this.player.api('paused', function(paused) {
					if(typeof cb === 'function'){ cb(paused); } else{ return paused; }
				});
			}
			else if(self.options.type === "youtube"){
				var isPaused;
				var state = this.player.getPlayerState();
				if(state === 2){ isPaused = true; } else{ isPaused = false; }
				if(typeof cb === 'function'){ cb(paused); } else{ return isPaused; }
			}
		}

		this.isFinished = function(cb){
			if(self.options.type === "vimeo"){
				if(typeof cb === 'function'){ cb(vimeoIsFinished); } else{ return vimeoIsFinished; }
			}
			else if(self.options.type === "youtube"){
				var isFinished;
				var state = this.player.getPlayerState();
				if(state === 0){ isFinished = true; } else{ isFinished = false; }
				if(typeof cb === 'function'){ cb(paused); } else{ return isFinished; }
			}
		}

		var _setup = function(){
			// First set up the iframe, then on the call back setup the video based on the type:
			_setupFrame(function(){
				if(self.options.type === "vimeo"){
					self.options['api'] = '1'
					self.api = vimeoApiScript;
					self.videoUrl = vimeoUrl;
					_setupVideo();
				}
				else if(self.options.type === "youtube"){
					self.options['enablejsapi'] = '1'
					self.api = youtubeApiScript;
					self.videoUrl = youtubeUrl;
					_setupVideo();
				}
			})
		}

		var _setupFrame = function(cb){
			if(self.options.type === "vimeo"){
				//  Create our iframe element
				var iframe = document.createElement('iframe');
				self.iframe = _setIFrameOption(iframe);
			}
			// Youtube overwrites the element with an iframe, so we must add a div as the placeholder for the iframe:
			else if(self.options.type === "youtube"){
				var iframe_attatch = document.createElement('div');
				self.iframe = _setIFrameOption(iframe_attatch);

			}

			if(self.options.parent !== null){
				self.options.parent.insertBefore(self.iframe, self.options.parent.firstChild);
			}
			else{
				document.body.appendChild(self.iframe);
			}

			if(typeof cb === 'function' ){
				cb();
			}
		}

		var _setIFrameOption = function(iframe){
			iframe.setAttribute("id", self.options.iframe_id);
			if(self.options.type === "vimeo"){
				//  Set our iframe attributes:
				//  Set our class to be the type of player we are using:
				iframe.setAttribute("class", self.options.type);
				//  Set allow fullscreen, no reason to not add it:
				iframe.setAttribute("webkitallowfullscreen", "");
				iframe.setAttribute("mozallowfullscreen", "");
				iframe.setAttribute("allowfullscreen", "");
				iframe.setAttribute("data-td-video", "");
				self.options.frameborder ? iframe.setAttribute("frameborder", self.options.frameborder) : iframe.setAttribute("frameborder", '0');
				self.options.scrolling ? iframe.setAttribute("scrolling", self.options.scrolling) : iframe.setAttribute("scrolling", 'no');
				self.options.width ? iframe.setAttribute("width", self.options.width) : iframe.setAttribute("width", "100%");

				if(self.options.height){
					if(self.options.height === "auto"){
						var vidHeight = Math.floor( screen.width / (16.0/9.0));
						iframe.setAttribute("height", vidHeight);
					}
					else{
						iframe.setAttribute("height", self.options.height);
					}
				}
				else{
					iframe.setAttribute("height", "100%");
				}
			}
			return iframe;
		}

		var _setupVideo = function(){
			// Build the Vimeo url:
			if(self.options.type === "vimeo"){
				self.iframe.src = _buildURL();
			}
			// Add our video script to the dom:
			_loadScript(self.api, function(status){
				//  Once the script has been loaded, build the player:
				if(status){	
					//  Only call for vimeo, yourutbe will wiat for the event callback:
					if(self.options.type === "vimeo"){
						_buildPlayer();						
					}
				}
				else{
					throw "Could not load Script";
				}
			})
		}


		var _buildURL = function(){
			//  Build the url, must pass in the iframe id, or it will not work!
			var videoUrl = self.videoUrl + self.options.video_id  + '/?&player_id=' + self.options.iframe_id 
			//  Map our video options and add them to the url:
			Object.keys(self.options.settings).forEach(function (key) {
				videoUrl += '&' + key + '=' + self.options.settings[key];
			})
			return videoUrl;
		}


		var _buildPlayer = function(){
			if(self.options.type === "vimeo"){
				// build our vimeo player:
		       	self.player = new $f(self.iframe);
		       	// Add our event listeners for vimeo:
		       	_addViemoApiCalls(_addEventListeners);
		       	finalCallBack();
			}
			if(self.options.type === "youtube"){
				_setupYoutubeOptions(function(options){
					self.player = new YT.Player(self.options.iframe_id, options);
					finalCallBack();
				})
			}
			
		}

		// Event listener functions for Vimeo:
		function _addEventListeners(){
       		//  Map our events to the correct listeners:
			self.player.addEvent('ready', function(){
				Object.keys(self.options.events).forEach(function (key) {
					if(key === 'ready'){
						_readyEventHack.call(self);
					}
					else if(key === 'pause'){
						self.player.addEvent(key, _pauseEventHack.bind(self));
					}
					else if(key === 'play'){

						self.player.addEvent(key, _playEventHack.bind(self));
					}
					else if(key === 'finish'){

						self.player.addEvent(key, _finishEventHack.bind(self));
					}
					else{
						self.player.addEvent(key, self.options.events[key].bind(self));
					}
				})
				// Add the playProgress event listener, to set our vimeoIsPlaying var
				// Vimeo API has no is-playing function or state like youtube
				self.player.addEvent('playProgress', _isPlayingHack.bind(self));

			})
		}

		var _finishEventHack = function(){
			vimeoIsFinished = true;
			if(typeof  self.options.events['finish'] === "function"){
				self.options.events.finish.call(self);
			}
		}

		var _isPlayingHack = function(data){
			if(data.percent === 1){ vimeoIsFinished = true; } else{ vimeoIsFinished = false; }
			vimeoIsPlaying = true;
		}

		var _readyEventHack = function(){
		    self.player.api('setVolume', self.options['volume']);
			if(typeof  self.options.events['ready'] === "function"){
				self.options.events.ready.call(self);
			}
		}

		//  Hack functions that will run our eventHandler function only once:
		var _playEventHack = function(){
			vimeoIsPlaying = true;
			if(typeof  self.options.events['play'] === "function"){
				self.options.events.play.call(self);
			}
		}

		//  Hack functions that will run our eventHandler function only once:
		var _pauseEventHack = function(){
			vimeoIsPlaying = false;
			if(typeof  self.options.events['pause'] === "function"){
				self.options.events.pause.call(self);
			}
		}


		window.onYouTubeIframeAPIReady = _buildPlayer.bind(self);

		var _onPlayerReady = function(event){
			self.iframe = self.player.a;
			self.iframe.setAttribute("data-td-video", "");
			self.player.setVolume(self.options['volume']);
			if(typeof  self.options.events['ready'] === "function"){
		 		self.options.events['ready'].call(self, event);
			}
		}

	     var finalCallBack = function(){
			// If we passed a call back function, call it and return the player:
			if(typeof init_cb === 'function' ){
				self.debounce = _debounce;
				init_cb(self)
				init_cb = undefined;
			}
	     }

		var _setupYoutubeOptions = function(cb){
			var ytOptions = { playerVars: {}};
			Object.keys(self.options).forEach(function (key) {
				if(key === 'settings'){
					Object.keys(self.options['settings']).forEach(function (s_key) {
						if(s_key === 'fullscreen'){
							ytOptions.playerVars['allowfullscreen'] = self.options['settings'][s_key]
						}
						else if(s_key === 'loop' && self.options['settings']['loop'] === 1){
							if(self.options['settings']['playlist'] === undefined){
								ytOptions.playerVars['playlist'] = self.options['video_id'];
							}
							ytOptions.playerVars[s_key] = self.options['settings'][s_key]
						}
						else{
							ytOptions.playerVars[s_key] = self.options['settings'][s_key]
						}
					})
				}
				else if(key !== 'events' && key !== 'parent' && key != 'video_id' && key != 'height' && key != 'width'){
					ytOptions.playerVars[key] = self.options[key];
				}
				else if(key !== 'events' && key !== 'parent'){
					if(key === "video_id"){
						ytOptions['videoId'] = self.options[key]
					}
					else{
						ytOptions[key] = self.options[key]
					}
				}
			})
			if(self.options.height){
				if(self.options.height === "auto"){
					var vidHeight = Math.floor( screen.width / (16.0/9.0));
					ytOptions["height"] = vidHeight;
				}
				else{
					ytOptions["height"] = self.options.height;
				}
			}
			else{
				ytOptions["height"] = "100%";
			}

			ytOptions['events'] = {
				'onReady':_onPlayerReady.bind(self),
				'onStateChange' : _onPlayerStateChange.bind(self.player)
			}
			if(typeof cb === "function"){
				cb(ytOptions);
			}
			else{
				return ytOptions;
			}
		}

		var _onPlayerStateChange = function(event) {
			if(event.data == "1") {
				if(typeof  self.options.events['play'] === "function"){
					self.options.events['play'].call(self);
				}
			}
			else if(event.data == "2") {
				if(typeof  self.options.events['pause'] === "function"){
					self.options.events['pause'].call(self);
				}
			 }
			else if(event.data == "0") {
				if(typeof  self.options.events['finish'] === "function"){
					self.options.events['finish'].call(self);
				}
			}
		}

		var _addViemoApiCalls = function(cb){
	       	self.player.playVideo = function(){
	       		self.player.api("play");
	       	}
	       	self.player.setVolume = function(volume){
	       		self.player.api('setVolume', volume);
	       	}
	       	self.player.pauseVideo = function(volume){
	       		self.player.api("pause");
	       	}
	       	self.player.mute = function(){
	       		self.player.api('setVolume', 0);
	       	}
	       	self.player.stopVideo = function(){
	       		self.player.api('pause');
	       	}

	       	if(typeof cb === "function"){
	       		cb.call(this);
	       	}

		}

		//  Helper function to load in our player scripts:
		function _loadScript(path, cb) {
			var loaded = false;
			// Check if script has already loaded, and if so don't load the script again:
			if(self.options.type === "youtube"){
				 if(window.YT !== undefined && window.YT.loaded){
				 	loaded = true;
					window.onYouTubeIframeAPIReady.call(self);
				 }
			}
			else if(self.options.type === "vimeo"){

				if(window.$f !== undefined){
					loaded = true;
					_buildPlayer.call(self);
				}
			}
			if(!loaded){
			    var done = false;
			    var scr = document.createElement('script');
			    scr.onload = handleLoad;
			    scr.onreadystatechange = handleReadyStateChange;
			    scr.onerror = handleError;
			    isIE(function(ie){
			    	if(ie){
				    	scr.src = window.location.protocol + path;
				    }
				    else{
				    	scr.src = path;
				    }
			    })

				if(self.options.parent !== null){
					self.options.parent.appendChild(scr);
				}
				else{
					 document.body.appendChild(scr);
				}
			}

		    function handleLoad() {
		        if (!done) {
		            done = true;
		            cb(done);
		        }
		    }

		    function handleReadyStateChange() {
		        var state;
		        if (!done) {
		            state = scr.readyState;
		            if (state === "complete") {
		                handleLoad();
		            }
		        }
		    }
		    function handleError() {
		        if (!done) {
		            done = true;
		            cb(false);
		        }
		    }
		}
	
		// Helper function for slowing down constant dom calls ie - window.resize:
		var _debounce = function(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};

		function isIE(cb) {
		  var sAgent = window.navigator.userAgent;
		  var Idx = sAgent.indexOf("MSIE");
		  var _isIE = false;
		  // If IE, return version number.
		  if (Idx > 0 || !!navigator.userAgent.match(/Trident\/7\./)){
		    _isIE = true;
		  }
		  if(typeof cb === "function"){
		  	cb(_isIE)
		  }
		}
	}

