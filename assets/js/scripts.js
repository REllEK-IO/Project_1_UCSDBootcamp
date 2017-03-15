

var artistURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=cher&api_key=932e4c349b7caae7626ea15a10649e1f&format=json";
var albumURL = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=932e4c349b7caae7626ea15a10649e1f&artist=cher&album=believe&format=json";

// //Creates a songlist in the dom which the user can add songs contained in the list to the current Playlist
// //
// //@searchTerm is [artist, musicName] @typeOfSearch determines if searchTerm is for album or artist
// var SongList = function(searchTerm,typeOfSearch){
// 	console.log(passed here);
//     //Single input for album
//     this.artistName = [];
//     this.portrait = [];

//     //Always an array
//     this.songName = [];
//     this.streamPage = [];

//     self = this;

//     this.addSong = function(e){
//         console.log(e.attr("songName"));
//     }

//     this.createTable = function(){
//         if(searchTerm === "artist"){
//             for (var i = 0; i < self.songName.length; i++) {
//                 $("#songList").append("<tr>")
//                                 .append($("<th>").html("<image src = '" + self.portrait[i] + "'>"))
//                                 .append($("<th>").html(self.artistName[i]))
//                                 .append($("<th>").html(self.songName[i]))
//                                 .append($("<th>").html("<a href='" + self.streamPage[i] + "'>LastFM Song Page</a>"))
//                                 .append($("<th>").html("<span id='" + self.songName[i] + i +"'' songName='" + self.songName[i] + " " + self.artistName[i] + "'>" + "+" + "</span>")
//                                     .click(function(e){self.addSong(e)}));
//             }
//         }
//         else if(searchTerm === "album"){
//             for (var i = 0; i < self.songName.length; i++) {
//                 $("#songList").append("<tr>")
//                                 .append($("<th>").html("<image src = '" + self.portrait + "'>"))
//                                 .append($("<th>").html(self.artistName))
//                                 .append($("<th>").html(self.songName[i]))
//                                 .append($("<th>").html("<a href='" + self.streamPage[i] + "'>LastFM Song Page</a>"))
//                                 .append($("<th>").html("<span id='" + self.songName[i] + i +"'' songName='" + self.songName[i] + " " + self.artistName + "'>" + "+" + "</span>")
//                                     .click(function(e){self.addSong(e)}));
//             }
//         }
//     }

//     this.fillSongList = function(){
//         if(typeOfSearch === "artist"){
//             var artistURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + searchTerm[0] + "&api_key=932e4c349b7caae7626ea15a10649e1f&format=json";
//             $.ajax({
//                 url: artistURL, 
//                 method: 'GET'
//             }).done(function(response){
//                 for(var i = 0; i < response.toptracks.track.length; i++)
//                 {
//                     self.songName.push(response.toptracks.track[i].name);
//                     self.artistName.push(response.toptracks.track[i].artist.name);
//                     //Gets the medium sized portrait
//                     self.portrait.push(response.toptracks.track[i].image[1]["#text"]);
//                     self.streamPage.push(response.toptracks.track[i].url);
//                 }
//             });
//         }
//         else if(typeOfSearch === "album"){
//             var albumURL = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=932e4c349b7caae7626ea15a10649e1f&artist="+ searchTerm[0] + "&album=" + searchTerm[1] + "&format=json";
//             $.ajax({
//                 url: albumURL, 
//                 method: 'GET'
//             }).done(function(response){
//                 self.artistName = response.album.artist;
//                 self.portrait = response.album.image[1]["#text"];

//                 for(var i = 0; i < response.album.tracks.track.length; i++)
//                 {
//                     self.songName = response.album.tracks.track[i].name;
//                     self.streamPage = response.album.tracks.track[i].url;
//                 }
//             });
//         }
//         else{
//             console.log("<<<!!!Error At SongList: typeOfSearch was not within bounds!!!>>>");
//         }

//         console.log("Attempting to add songlist");

//         $("#songList").removeClass("hide");
//         self.createTable();
//     }();

//     this.clearSongList = function(){
//         this.songName = [];
//         this.artistName = [];
//         this.portrait = [];
//         this.streamPage = [];
//         $("#songList").empty();
//         $("#songList").addClass("hide");
//     }   
// }

var createSearchResults = function(stuff){
	console.log(queryURL);
}

var search = "Apple";
var apiKey = "AIzaSyC6KOmJ_6LXQJg_fa5qwpl1L20JWwW-NiY";

var queryURL = "https://www.googleapis.com/youtube/v3/search?" + 
       //"part=snippet" +
        //Orders by view count
        //"&order=viewCount" +
        "&q=" + encodeURI(search) +
        "&part=player" +
        //Type is video
        //"&type=video" + 
        //Video has hugh defintion
        //"&videoDefinition=high";
        "&key=" + apiKey;
        //https://www.googleapis.com/youtube/v3/search?q=cat&part=snippet&key=AIzaSyC6KOmJ_6LXQJg_fa5qwpl1L20JWwW-NiY

$.ajax({
		url: queryURL, 
		method: 'GET'
}).done(createSearchResults);