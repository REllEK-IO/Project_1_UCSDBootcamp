var player;
var video = "";
var playlist = ""

var Song = function(name, artist){
	this.songName = name;
	this.artistName = artist;
	this.viewCount;

	self = this;

	this.getSongId = function(){
		var search = this.songName + " Acoustic";

		if(search === ""){
			search = "Acoustic Kitty"
		}

		//https://www.googleapis.com/youtube/v3/search?&q=cat&part=snippet&type=video&key=AIzaSyC6KOmJ_6LXQJg_fa5qwpl1L20JWwW-NiY

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
        "&order=viewCount" +
        "&topicId=/m/04rlf"
        "&key=" + apiKey;

        console.log(queryURL);

		$.ajax({
			url: queryURL, 
			method: 'GET'
		}).done(function(response){
			$.ajax({
				url: "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" + response.items[0].id.videoId + "&key=AIzaSyC6KOmJ_6LXQJg_fa5qwpl1L20JWwW-NiY", 
				method: 'GET'
			}).done(function(data){
				self.id = response.items[0].id.videoId;
				self.viewCount = data.items.statistics.viewCount;
			});
		});
	}

	this.id = this.getSongId();
}

var Playlist = function(){
	this.playlistItems = [];
	
	//
	//@song: Get from SearchList artist and song
	this.addSong = function(artist, song){
		this.playlistItems.push(new Song(song, artist));
	}

	//Refreshes playlist table with current song values
	this.refreshPlaylist = function(){
		$("#playlistTable").empty();

		//Default labels for after empty
		var labels = $("<tr>").append($("<th>").html("Title"))
							.append($("<th>").html("Artist"))
							.append($("<th>").html("X"))
		$("#playlistTable").append(labels);

		//Populate playlist table with playlistItems content
		for (var i = 0; i < this.playlistItems.length; i++) {
			$("#playlistTable").append($("<tr>").append($("<th>").html(this.playlistItems[i].songName))
												.append($("<th>").html(this.playlistItems[i].artistName))
												.append($("<th>").html(this.playlistItems[i].id))
			);
		}
	}

	//Refreshes player with current playlist
	this.addPlaylist = function(){
		var playlistCondensed = "";
		for (var i = 0; i < playlistItems.length; i++) {
			playlistCondensed += "," + playlistItems[i].id;
		}
		loadPlaylist(playlistCondensed);
	}
}

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

var searchYoutube = function(){
	var search = $("#search").val();

		if(search === ""){
			search = "Acoustic Kitty"
		}

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
			$("loading").removeClass("hidden");
			playlist = response.items[0].id.videoId;
			video = response.items[0].id.videoId;
			for (var i = 1; i < response.items.length; i++) {
				playlist += "," + response.items[i].id.videoId;
			}
			console.log(playlist);
			addPlayer(playlist, video);
		});
}

var mutePlayer = function(){
	player.mute();
}

var loadPlaylist = function(playlistVal){
	player.loadPlaylist(playlistVal);
}

// var p = 'NS0txu_Kzl8,5dsGWM5XGdg,tntOCGkgt98,M7lc1UVf-VE';
// addPlayer(p);

$(document).ready(function(){
	var YoutubePlaylist = 

	$("#submit").click(function(e){
		e.preventDefault();
		searchYoutube();
	})

	$("#mute").click(function(e){
		e.preventDefault();
		mutePlayer();
	});

	$("#load").click(function(e){
		e.preventDefault();
		loadPlaylist('NS0txu_Kzl8,5dsGWM5XGdg,tntOCGkgt98,M7lc1UVf-VE');
	});
	
})