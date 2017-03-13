
//Test Vars
var artistURL = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=cher&api_key=932e4c349b7caae7626ea15a10649e1f&format=json";
var albumURL = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=932e4c349b7caae7626ea15a10649e1f&artist=Cher&album=Believe&format=json";

//If album/artist is searched Add this object to DOM

/**
* Handle the response for a specific category.
* TODO: implement the artist
*
* @intitial Object that contain the Album/Artist response from the Last.fm API
*/

var Songlist = function(data){
	this.songName = data.toptracks.tracks[0].name;
	this.artistName = data.toptracks.tracks[0].artist.name;
	this.image = data.toptracks.tracks[0].image[1].#text;
	console.log(this.songName + " " + this.artistName + " " + this.image);
}

$(document).ready(function(){
	$.ajax({
		url: queryURL, 
		method: 'GET'
	}).done(function(data){
		Songlist(data);
	});
});




