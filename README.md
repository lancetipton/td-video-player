
# TD Video player library:


### To use:
Simple:
```
HTML:
<div class="video-slide-container"   id="video_player-{{videoid}}" data-video-player  data-video-type="{{youtube|vimeo}}" data-video-id="{{videoid}}"  ></div>

JS:
// Get the Wrapper:
vidWrapper = $("[data-video-player]");

// Get the data:
var videoId = vidWrapper.attr("data-video-id");
var videoType =  vidWrapper.attr("data-video-type");

// Create an new video player:
new vp().init();
```
The init function takes two arguments, an object that holds an options object, and a callback funtion when the video player has been built. Here is an example of how it works:
Notice: { options: { ...put options here... } }

```
HTML:
<div class="video-slide-container"   id="video_player-{{videoid}}" data-video-player  data-video-type="{{youtube|vimeo}}" data-video-id="{{videoid}}"  ></div>

JS:
// Get the Wrapper:
vidWrapper = $("[data-video-player]");

// Get the data:
var videoId = vidWrapper.attr("data-video-id");
var videoType =  vidWrapper.attr("data-video-type");

// Create an new video player:
new vp().init({
	options: {
		parent: vidWrapper, 
		type: videoType,
		video_id : videoId,
		iframe_id: 'video-iframe-' + videoId,
		frameborder: 0,
		scrolling: 'no',
		width: "100%",
		height: "auto",
		volume: volume,
		settings: {
			autoplay: autoplay,
			loop: 1,
			fullscreen: 1,
			controls : 0,
			modestbranding : 1,
			vq: '720',
		      	rel: 0,
		      	showinfo : 0,
		      	wmode: "transparent",
		},
		// Callback functions
		events: {
			ready: onReady,
			play: onPlay,
			pause: onPause,
			finish: onFinish,
		},
	}
}, onPlayerInit)


// Main callback after player init:
function onPlayerInit(_videoPlayer){

}

```
When you create a new player and call init you can pass in options object. For settings see above code. You can also pass in an events object inside of the options object.
Ex: var options = { events: {} };
new vp().init({options: options});

Inside of the events object you can put event to listen for change to the video player. It would look something like this:
Ex: 

```
var options = { 
	events: {
		ready: onReady,
		play: onPlay,
		pause: onPause,
		finish: onFinish,
	},
};

new vp().init({options: options});

// When player is ready callback:
function onReady(){
	// do stuff

	// These callbacks are bound to the video player, so (this === current video player)
	// var videoPlayer = this;
	// videoplayer.player.playVideo();
	// or
	// this.player.playVideo();
}

// Call onPlay Callback function:
function onPlay(){
	// do stuff
}

function onPause(){
// do stuff
}
function onFinish(){
// do stuff
}


```
### List of Options defaults:
```
options = {
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


```

### That's it.


