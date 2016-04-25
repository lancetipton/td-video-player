TDYPlayer = function(){

  this.playerVars =  {};
  this.doResize = false;
  this.playlistIds = [];

  this.init = function(id, args, return_cb){
    this.return_cb = return_cb;
    this.setVars(args);
    this.loadAPI(id);
    window.onYouTubePlayerAPIReady = this.buildPlayer.bind(this);
  };


  this.loadAPI = function(id){
    this.playerId = id;

    this.apiScript = document.createElement('script');
    this.apiScript.src = "http://www.youtube.com/player_api"

    document.body.appendChild(this.apiScript);

    this.apiScript.onerror = handleError.bind(this);
    // For Browsers except IE
    this.apiScript.onload = handleLoad.bind(this);
    // For IE
    this.apiScript.onreadystatechange = handleReadyStateChange.bind(this);  

  };


  var handleLoad = function(){
    this.loaded.bind(this);
  };


  var handleReadyStateChange = function(){
      this.state = this.scr.readyState;
      if (this.state === "complete") {
          handleLoad();
      }
  };

  var handleError = function(){
        throw "TD Error: Could not load Youtube Api!";
  };



  this.loaded = function(loaded, data){
    if(loaded){
      if(this.TDLib !== undefined){
        this.TDLib.pluginLoader.unload();

      }
      else if (typeof TDPluginLoader !== 'undefined') {
        TDPluginLoader.unload();
      }
    }
    else{
      throw data;
    }
  };

  this.buildPlayer = function(){
    this.element = document.getElementById(this.playerId);
    
    if(document.getElementById(this.playerId) !== null){
      this.player = new YT.Player(this.playerId, {
        height: this.height,
        width: this.width,
        videoId: this.videoId,
        playerVars: this.playerVars,
        events: {
          'onReady': this.onPlayerReady.bind(this),
          'onStateChange': this.onPlayerStateChange.bind(this)
        }
      });
    }
    else if(this.logErrors){
      console.log("TD Error: Could not find element to attach the YT Player. Please pass an existing element ID as the first parameter when calling the init function!")
    }



  };

  this.onPlayerReady  = function(){
    this.element = document.getElementById(this.playerId);
    if(this.doResize === true){
      this.resize();
    }

    if(typeof this.return_cb === 'function'){
      return this.return_cb(this);
    }

  };

  this.onPlayerStateChange = function(){


  };

  this.setVars = function(args){
    for (var prop in args) {
        if (args.hasOwnProperty(prop)) {
            if(prop === "height"){ this.height = args[prop];}
            else if(prop === "width"){ this.width = args[prop];}
            else if(prop === "videoId"){ this.videoId = args[prop];}
            else if(prop === "logErrors"){ this.logErrors = args[prop];}
            else if(prop === "containerId"){ 
              this.container = document.getElementById(args[prop]);
            }
            else if(prop === "resize"){
              if(args[prop] === true){
                this.doResize = true;
                window.addEventListener('resize', this.resize.bind(this), true);
              }
            }
            else{
              this.playerVars[prop] = args[prop];
            }
        }
    }
  };


  this.resize = function(cb){
    
    if(this.element){

      if(this.container){
        var width = parseInt(window.getComputedStyle(this.container).width);
        this.element.height = (width / 2).toString() + "px";

        this.width = width.toString() + "px";
        this.height = this.container.height;        
      }

      var width = parseInt(window.getComputedStyle(this.element).width);
      this.element.height = (width / 2).toString() + "px";

      this.width = width.toString() + "px";
      this.height = this.element.height;
    }


    if(typeof cb === 'function'){
      return cb(this);
    }
  }


  this.changeVideo = function(args, cb){
    this.player.loadVideoById({
      'videoId': args["videoId"],
      'startSeconds': args["start"],
      'endSeconds': args["end"],
      'suggestedQuality': args["quality"]
    })

    if(typeof cb === 'function'){
      return cb(this);
    }

  }

  this.cueVideo = function(args, cb){
    this.player.cueVideoById({
      'videoId': args["videoId"],
      'startSeconds': args["start"],
      'endSeconds': args["end"],
      'suggestedQuality': args["quality"]
    })

    if(typeof cb === 'function'){
      return cb(this);
    }
  }

  this.loadPlaylist = function(args, cb){
    this.player.loadVideoById({
      'videoId': args["videoId"],
      'startSeconds': args["start"],
      'endSeconds': args["end"],
      'suggestedQuality': args["quality"]
    })

    if(typeof cb === 'function'){
      return cb(this);
    }

  }

  this.cuePlaylist = function(args, cb){
    
    // if(args["videoIds"]){
    //   this.playlistIds = args["videoIds"];
    // }


    // this.player.cuePlaylist({
    //   listType: 'playlist',
    //   list: this.playlistIds,
    //   index: args["startOn"],
    //   startSeconds: args["start"],
    //   suggestedQuality: args["quality"]
    // })

    // // this.player.playVideo();

    // if(typeof cb === 'function'){
    //   return cb(this);
    // }
  }


  this.loadPlaylist = function(args, cb){
    
    if(args["videoIds"]){
      this.playlistIds = args["videoIds"];
    }

    this.player.loadPlaylist({
      playlist: this.playlistIds,
      index: args["startOn"],
      startSeconds: args["start"],
      suggestedQuality: args["quality"]
    })

    if(typeof cb === 'function'){
      return cb(this);
    }
  }


  this.addToPlaylist = function(videoId, cb){
    this.playlistIds.push(videoId)

    if(typeof cb === 'function'){
      return cb(this);
    }
  }

  return this;

}

/*

Youtube Options:
autohide = "2 / 1 / 0";
autoplay = "1 / 0";
cc_load_policy = "1 / 0";
color = "'red' / 'white'";
controls = "0 / 1 / 2";
disablekb = "1 / 0";
enablejsapi = "0 / 1";
end = "The parameter value is a positive integer, when player will stop playing a video";
fs = "1 / 0 - fullscreen";
hl = "Change lang";
iv_load_policy
list
listType
loop
modestbranding
origin
playerapiid
playlist
playsinline
rel
showinfo
start
theme

*/


