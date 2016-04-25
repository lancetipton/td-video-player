I have been created a number of simple and pure JavaScript plugins. These are a work in-progress, and will be updated periodically as I make changes to them, and optimize them. As of now they are nothing facy, but they get the job done. They are straight and to the point, and because of that they are pretty lightweight. Please feel free to use them all you want. Branch them, make changes, whatever you feel like doing.

I know there are plenty of great plugins out there that already to the same things. I have used them often, and they make life as a programmer better. The point is not to write a better or plugin, but more to go through process of building a library to understand how it’s done and what is requires. It is a great learning experience, and I encourage anyone who has never done it, to do so.

TD YouTube player library:

First create a new TDYPlayer object. Then call the init function and pass in the id of the element you want the YouTube player attatched to, as well as an object that contains the youtube player settings.

```

var ytPlayer = new TDYPlayer();
ytPlayer.init("yt-player", {
	height: "390",
	width: "640",
	videoId: "wipvcsYMtcs",
	autohide: 1,
	autoplay: 0
});	

```

If resizeHeight is passed as true, it adds a listener to the window to adjust the height relative to the width of the player as the screen gets bigger or smaller.

Change Player video (Autoplays the video once loaded):

```

ytPlayer.changeVideo({
	videoId: 'bHQqvYy5KYo',
	start: 5,
	end: 60,
	quality: 'large'
});

```

Cue Player video (Will not autoplay the video when loaded):

```

ytPlayer.queVideo({
	videoId: 'bHQqvYy5KYo',
	start: 5,
	end: 60,
	quality: 'large'
});

```




