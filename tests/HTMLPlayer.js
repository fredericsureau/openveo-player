"use strict"

window.assert = chai.assert;

// HTMLPlayer.js
describe("HTMLPlayer", function(){
  var player, playerElement, videoElement, $document, $injector, jWindowElement, $window;
  
  // Load module player
  beforeEach(module("ov.player"));
  
  // Dependencies injections
  beforeEach(inject(function(_$injector_, _$document_, _$window_){
    $window = _$window_;
    $injector = _$injector_;
    $document = _$document_;
  }));

  // Initializes tests
  beforeEach(function(){
    jWindowElement = angular.element($window);
    playerElement = $document[0].createElement("div");
    videoElement = $document[0].createElement("video");
    videoElement.setAttribute("id", "player_1");
    videoElement.load = function(){}
    videoElement.play = function(){}
    $document[0].body.appendChild(videoElement);
    
    var OvHTMLPlayer = $injector.get("OvHTMLPlayer"); 
    player = new OvHTMLPlayer(angular.element(playerElement), {
      type : "vimeo",
      mediaId : "1",
      timecodes : {},
      files : [{
        width : 640,
        height : 360,
        link : "http://video.mp4"
      }],
      pictures : [
        {
          width : 960,
          height : 540,
          link : "thumbnail.jpg"
        }
      ]
    });
    player.initialize();
  });
  
  // Destroy player after each test
  afterEach(function(){
    $document[0].body.removeChild(videoElement);
    videoElement = null;
    player.destroy();
  });

  it("Should be able to build Vimeo player url", function(){
    assert.equal(player.getMediaUrl(), "http://video.mp4");
  });
  
  it("Should be able to get media thumbnail", function(){
    assert.equal(player.getMediaThumbnail(), "thumbnail.jpg");
  });
  
  it("Should be able to play the media if paused", function(done){
    player.player.paused = true;
    
    videoElement.play = function(){
      done();
    };
    
    player.playPause();
  });  
  
  it("Should be able to play the media if ended", function(done){
    player.player.paused = false;
    player.player.ended = true;
    
    videoElement.play = function(){
      done();
    };
    
    player.playPause();
  });  
  
  it("Should be able to pause the media if playing", function(done){
    player.player.paused = false;
    
    videoElement.pause = function(){
      done();
    };
    
    player.playPause();
  });
  
  it("Should be able to set player's volume in percent", function(){
    player.player.volume = 0;
    player.setVolume(90);
    assert.equal(player.player.volume, 0.9);
  });  
  
  it("Should be able to set player's current time in milliseconds", function(){
    player.player.currentTime = 0;
    player.setTime(1000);
    assert.equal(player.player.currentTime, 1);
  });  

});