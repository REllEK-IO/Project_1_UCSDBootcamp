// var player;
// var video = "";
// var playlist = "";
// var searchType = "track";
// var tempArtist = "";
// var tempMusicName = "";

var databaseLength;

sessionStorage.setItem('tempArtist', ""); //sessionStorage.getItem('tempArtist')
sessionStorage.setItem('searchType', "track"); //sessionStorage.getItem('searchType')
sessionStorage.setItem('tempMusicName', ""); //sessionStorage.getItem('tempMusicName')
sessionStorage.setItem('playerExists',"false");
//sessionStorage.setItem('playerExists', 'false');

var PossibleSongs;

var database = firebase.database();

//Creates a songlist in the dom which the user can add songs contained in the list to the current Playlist
//
//@searchTerm is [artist, musicName] @typeOfSearch determines if searchTerm is for album or artist
var SongList = function(searchTerm,typeOfSearch){
	console.log("passed here");
    //Single input for album

    this.search = searchTerm[0];
    this.searchNext = searchTerm[1];

    this.artistName = [];
    this.portrait = [];

    //Always an array
    this.songName = [];
    this.streamPage = [];

    self = this;

    this.addSong = function(e){
        
        console.log(e.attr("songName"));
    }

    this.createTable = function(){
        console.log("Attempting to add songlist", self.songName);

        $("#songList").empty();

        var labels = $("<tr>").append($("<th>").html("Icon"))
							.append($("<th>").html("Artist"))
							.append($("<th>").html("Song"))
							.append($("<th>").html("Stream Page"))
							.append($("<th>").html("Add to Playlist"))
		$("#songList").append(labels);

        if(typeOfSearch === "artist"){
        	console.log("For artist");
            for (var i = 0; i < self.songName.length; i++) {
            	
                var tempRow = $("<tr>")
                tempRow.append($("<th>").html("<image src = '" + self.portrait[i] + "'>"));
                tempRow.append($("<th>").html(self.artistName[i]));
                tempRow.append($("<th>").html(self.songName[i]));
                tempRow.append($("<th>").html("<a href='" + self.streamPage[i] + "'>LastFM Song Page</a>"));
                tempRow.append($("<th>").html("<span class='add-song' id='" + self.songName[i] + i +"'' songName='" + self.songName[i] + "' artistName='" + self.artistName[i] + "'>" + "+" + "</span>"));
                $("#songList").children().append(tempRow);
            }

            $(".add-song").click(function(){
            	YoutubePlaylist.addSong($(this).attr("songName"), $(this).attr("artistName"));
            });

            initYoutubeSearchButtons();
        }
        else if(typeOfSearch === "album"){
        	console.log("For album");
        	console.log(self.songName.length);
            for (var i = 0; i < self.songName.length; i++) {
                var tempRow = $("<tr>")
                tempRow.append($("<th>").html("<image src = '" + self.portrait + "'>"));
                tempRow.append($("<th>").html(self.artistName));
                tempRow.append($("<th>").html(self.songName[i]));
                tempRow.append($("<th>").html("<a href='" + self.streamPage[i] + "'>LastFM Song Page</a>"));
                tempRow.append($("<th>").html("<span class='add-song' id='" + self.songName[i] + i +"'' songName='" + self.songName[i] + "' artistName='" + self.artistName + "'>" + "+" + "</span>"));
                $("#songList").children().append(tempRow);
            }

            $(".add-song").click(function(){
            	YoutubePlaylist.addSong($(this).attr("songName"), $(this).attr("artistName"));
            	YoutubePlaylist.refreshPlaylist();
            });

            initYoutubeSearchButtons();
        }
        else{
        	console.log("Passed a track or unassigned search");
        }
    }

    this.fillSongList = function(){
        if(typeOfSearch === "artist"){
            var artistURL = "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + self.search + "&api_key=932e4c349b7caae7626ea15a10649e1f&format=json";
            
            $.ajax({
                url: artistURL, 
                method: 'GET'
            }).done(function(response){
            	var forControl = response.toptracks.track.length;
            	console.log(response);
            	if(response.toptracks.track.length > 5){
            		forControl = 5;
            	}

                for(var i = 0; i < forControl; i++)
                {
                    self.songName.push(response.toptracks.track[i].name);
                    self.artistName.push(response.toptracks.track[i].artist.name);
                    //Gets the medium sized portrait
                    self.portrait.push(response.toptracks.track[i].image[1]["#text"]);
                    self.streamPage.push(response.toptracks.track[i].url);
                }
                $("#songList").removeClass("hidden");
        		self.createTable();
        		
            });
        }
        else if(typeOfSearch === "album"){
            var albumURL = "https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=932e4c349b7caae7626ea15a10649e1f&artist="+ self.search + "&album=" + self.searchNext + "&format=json";

            $.ajax({
                url: albumURL, 
                method: 'GET'
            }).done(function(response){
            	var forControl = response.album.tracks.track.length;
            	console.log(response);
            	if(response.album.tracks.track.length > 5){
            		forControl = 5;
            	}

                self.artistName = response.album.artist;
                self.portrait = response.album.image[1]["#text"];

                for(var i = 0; i < forControl; i++)
                {
                    self.songName.push(response.album.tracks.track[i].name);
                    self.streamPage.push(response.album.tracks.track[i].url);
                }
                $("#songList").removeClass("hidden");
        		self.createTable();
        		
            });
        }
        else{
            console.log("<<<!!!Error At SongList: typeOfSearch was not within bounds!!!>>>");
        }
    }(); 
}

//Song Object, contains a single api call to youtube to obtain a @this.id
//
//@name is the name of the song @artist is the name of the song's artist
var Song = function(name, artist){
	this.songName = name;
	this.artistName = artist;

	sessionStorage.setItem('tempMusicName', '');
	sessionStorage.setItem('tempArtist', '');

	self = this;

	this.getSongId = function(){
		var search = self.songName + " " + self.artistName + " Acoustic -lyrics -live";

		if(search === ""){
			search = "Acoustic Kitty"
		}

		//https://www.googleapis.com/youtube/v3/search?&q=cat&part=snippet&type=video&key=AIzaSyC6KOmJ_6LXQJg_fa5qwpl1L20JWwW-NiY

		var apiKey = "AIzaSyAdyUe4SKUg4MAl4qpKhHu3ZnWnJTtiy_k";
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
        "&topicId=/m/04rlf" +
        "&key=" + apiKey;

        console.log(queryURL);

		$.ajax({
			url: queryURL, 
			method: 'GET'
		}).done(function(response){
			if(response.items.length === 0 || response.items.length === undefined){
				self.id = "Not Found";
			}
			else{
				self.id = response.items[0].id.videoId;
			}
			YoutubePlaylist.refreshPlaylist();
		});
	}();
}

//Object Wrapper for the playlist table
//
//Holds song objects as an array the joins their ids to create a Youtube Playlist
var Playlist = function(){
	this.playlistItems = [];
	self = this;
	this.playlistCondensed = "";
	//


	// this.removeSong = function(id){
	// 	for(var i = 0; i > playlistItems.length; i++){
	// 		if()
	// 	}
	// }

	//Refreshes playlist table with current song values
	this.refreshPlaylist = function(){
		$("#playlistTable").empty();

		//Default labels for after empty
		var labels = $("<tr>").append($("<th>").html("Title"))
							.append($("<th>").html("Artist"))
							.append($("<th>").html("ID"))
							.append($("<th>").html("Remove"))
		$("#playlistTable").append(labels);

		//Populate playlist table with playlistItems content
		for (var i = 0; i < this.playlistItems.length; i++) {
			$("#playlistTable").append($("<tr>").append($("<th>").html(this.playlistItems[i].songName))
												.append($("<th>").html(this.playlistItems[i].artistName))
												.append($("<th>").html(this.playlistItems[i].id))
												.append($("<th>").html("<span class='red' index='" + i +"'>X</span>"))
			);
		}

		$(".red").click(function(){
			var remove = Number($(this).attr("index"));
			YoutubePlaylist.playlistItems = YoutubePlaylist.playlistItems.splice(remove, 1);
			$(this).removeClass();
			$(this).off();
			$(this).addClass("true-red");
		})
	}

	//Refreshes player with current playlist
	this.addPlaylist = function(){
		if(this.playlistItems[0].id !== "Not Found")
		{
			this.playlistCondensed = this.playlistItems[0].id;
		}
		for (var i = 1; i < this.playlistItems.length; i++) {
			if(this.playlistItems[i].id !== "Not Found")
			{
				this.playlistCondensed += "," + this.playlistItems[i].id;
			}
		}
		console.log(this.playlistCondensed);
		player.loadPlaylist(this.playlistCondensed);
	}

	//@song: Get from SearchList artist and song
	this.addSong = function(song, artist){
		this.playlistItems.push(new Song(song, artist));;	
	}

	this.loadPlaylist = function(newList){
		this.playlistItems = newList.split(',');
		this.addPlaylist();
	}

	this.savePlayist = function(){
		if(this.playlistItems[0].id !== "Not Found")
		{
			this.playlistCondensed = this.playlistItems[0].id;
		}
		for (var i = 1; i < this.playlistItems.length; i++) {
			if(this.playlistItems[i].id !== "Not Found")
			{
				this.playlistCondensed += "," + this.playlistItems[i].id;
			}
		}
		return this.playlistCondensed;
	}
}

//Creates the Youtube player object and sets it to @player
function onYouTubePlayer() {
  player = new YT.Player('player', {
    height: '490',
    width: '880',
    videoId: "xBfBYfPNXqE",
    //Big list of control variables for the youtube player
    playerVars: { rel:0,modestbranding: 1,controls:1, showinfo: 1, rel: 0, showsearch: 0, autoplay:1, iv_load_policy:3 },
    events: {
      'onStateChange': onPlayerStateChange,
      'onError': catchError
    }
  });
}

//Youtube API control variable for onPlayerStateChange
var done = false;


function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING && !done) {
	  // setTimeout(stopVideo, 6000);
	  done = true;
	}
}

//Need this call to stop errors
function onPlayerReady(event) {

//if(typeof(SONG.getArtistId()) == undefined)
//{
//  console.log("undefineeeed"); 
//} 
//event.target.playVideo();   
}

//If the player crashes
function catchError(event)
{
if(event.data == 100) console.log("The player fucked up");
}

//Call for the player to stop
function stopVideo() {
player.stopVideo();
}

//Loads in the script needed for the youtube player
var loadPlayer = function(){
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";

		var firstScriptTag = document.getElementsByTagName('script')[0];

		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		 
		window.onYouTubePlayerAPIReady = function() {
     		onYouTubePlayer();
    	};
}

//Removes top content to make room for player
var slideOutTop = function(){
	$("#welcome").empty();
	$("#welcome").css("height", "50px");
}

//
var searchYoutube = function(){
	var search = $("#search").val();

	if(sessionStorage.getItem("playerExists") === "true"){
		disableSearchButton();
		// console.log("Player already Exists", sessionStorage.getItem('searchType'));

		if(sessionStorage.getItem('searchType') === "artist" || sessionStorage.getItem('searchType') === "album"){
			PossibleSongs = new SongList([sessionStorage.getItem('tempArtist'),sessionStorage.getItem('tempMusicName')],sessionStorage.getItem('searchType'));
		}
		else{
			if(sessionStorage.getItem("artistName") !== ''){
				YoutubePlaylist.addSong(sessionStorage.getItem("tempMusicName"), sessionStorage.getItem("tempArtist"));
			}
			else{
				YoutubePlaylist.addSong(search);
			}
			initYoutubeSearchButtons();
		}
	}
	else{
		loadPlaylist();
		disableSearchButton();
		console.log("Player does not exist", sessionStorage.getItem('searchType'));
		if(sessionStorage.getItem('searchType') === "artist" || sessionStorage.getItem('searchType') === "album"){
			PossibleSongs = new SongList([sessionStorage.getItem('tempArtist'),sessionStorage.getItem('tempMusicName')],sessionStorage.getItem('searchType'));
		}
		else{
			if(sessionStorage.getItem("artistName") !== ''){
				YoutubePlaylist.addSong(sessionStorage.getItem("tempMusicName"), sessionStorage.getItem("tempArtist"));
			}
			else{
				YoutubePlaylist.addSong(search);
			}
			initYoutubeSearchButtons();
		}
	}
}

var mutePlayer = function(){
	player.mute();
}

var loadPlaylist = function(playlistVal){
	var search = $("#search").val() + " Acoustic";
	if(sessionStorage.getItem("playerExists") === "true"){
		player.loadPlaylist(playlistVal);
	}
	else{
		// console.log("+++++++++++++++++++++++++++++++++++++++++++++++++");
		//player.loadPlaylist(playlistVal);
		if(search === ""){
			search = "Acoustic Kitty"
		}
		else{
			search += " Acoustic -lyrics -live"
		}

		console.log("++++++++++++++++++" + search);

		var apiKey = "AIzaSyAdyUe4SKUg4MAl4qpKhHu3ZnWnJTtiy_k";
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
	    "&topicId=/m/04rlf" +
	    "&key=" + apiKey;


	    //Trouble shooting IDs: ('NS0txu_Kzl8,5dsGWM5XGdg,tntOCGkgt98,M7lc1UVf-VE');
		$.ajax({
			url: queryURL, 
			method: 'GET'
		}).done(function(response){
			sessionStorage.setItem("playerExists", "true");
			
			if(response.items[0].id.videoId !== undefined){
				player.loadPlaylist(response.items[0].id.videoId);
			}
		});
	}
}

var YoutubePlaylist = new Playlist();

// var savePlayistButton = function(){
// 	database.ref().child("playlist").on("value", function(snapshot) {
//   		databaseLength = Number(snapshot.numChildren());
//   		console.log(databaseLength);
  		
// 	});

// 	// database.ref().
// 	var currentList = YoutubePlaylist.savePlayist();

// }

// var loadFireBasePlaylist = function(){
// 	ref.child("playlist").on("value", function(snapshot) {
//   		databaseLength = Number(snapshot.numChildren());
  		
// 	});
// }

var initYoutubeSearchButtons = function(){
	$("#search").val("");

	$("#submit").click(function(e){
		e.preventDefault();
		searchYoutube();
		//YoutubePlaylist.addPlaylist();
	});

}

var disableSearchButton = function(){
	$("#submit").off();
}

$(document).ready(function(){
	loadPlayer();

	sessionStorage.setItem("playerExists", "false");
	initYoutubeSearchButtons();

	$("#submit").one("click", function(){
		slideOutTop();

		if(sessionStorage.getItem('searchType') === 'track'){
			setTimeout(function(){
				YoutubePlaylist.addPlaylist();
			}, 1000);
		}
		
	});

	$("#mute").click(function(e){
		e.preventDefault();
		mutePlayer();
	});

	$("#load").click(function(e){
		e.preventDefault();
		// loadPlaylist('NS0txu_Kzl8,5dsGWM5XGdg,tntOCGkgt98,M7lc1UVf-VE');
		YoutubePlaylist.addPlaylist();
	});

	// $("#save").click(function(e){
	// 	e.preventDefault();
	// 	savePlayistButton();
	// })
	
})