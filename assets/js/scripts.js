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