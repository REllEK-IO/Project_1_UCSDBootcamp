var player;
var video = "";
var playlist = ""

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: video,
      playerVars: {		modestbranding: 1,'playlist': playlist, autoplay: 0, showinfo: 1	},
      events: {
        'onReady': function (event) {
	        event.target.playVideo();
	      },
        'onStateChange': function (event) {
	        if (event.data == YT.PlayerState.PLAYING && !done) {
	          setTimeout(function () {
		        player.stopVideo();
		      }, 6000);
	          done = true;
	        }
	      }
      }

    });
}

var addPlayer = function(){
			// 2. This code loads the IFrame Player API code asynchronously.
	      // console.log(playlist);
	      var tag = document.createElement('script');

	      tag.src = "https://www.youtube.com/iframe_api";
	      var firstScriptTag = document.getElementsByTagName('script')[0];
	      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	      // 3. This function creates an <iframe> (and YouTube player)
	      //    after the API code downloads.
	      var done = false;

	      //todo use the playlist arg instead
			
		  onYouTubeIframeAPIReady(playlist,video);
	      
	      // 4. The API will call this function when the video player is ready.
	      

	      // 5. The API calls this function when the player's state changes.
	      //    The function indicates that when playing a video (state=1),
	      //    the player should play for six seconds and then stop.
	      
	      $('body').append(tag);
}

// var p = 'NS0txu_Kzl8,5dsGWM5XGdg,tntOCGkgt98,M7lc1UVf-VE';
// addPlayer(p);

$(document).ready(function(){
	var search = "Acoustic Kitty";
	var apiKey = "AIzaSyC6KOmJ_6LXQJg_fa5qwpl1L20JWwW-NiY";

	var queryURL = "https://www.googleapis.com/youtube/v3/search?" + 
		//Search query
        "&q=" + encodeURI(search) +
        //part type
        "&part=snippet" +
        //Api key
        "&type=video" +
        "&videoEmbeddable=true" +
        "&videoSyndicated=true" +
        "&key=" + apiKey;

        //addPlayer('NS0txu_Kzl8,5dsGWM5XGdg,tntOCGkgt98,M7lc1UVf-VE');
	$.ajax({
		url: queryURL, 
		method: 'GET'
	}).done(function(response){
		playlist = response.items[0].id.videoId;
		video = response.items[0].id.videoId;
		for (var i = 1; i < response.items.length; i++) {
			playlist += "," + response.items[i].id.videoId;
		}
		console.log(playlist);
		addPlayer(playlist, video);
	});
})

