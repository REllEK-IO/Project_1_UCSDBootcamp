var createSearchResults = function(stuff){
	console.log(queryURL);
}

var search = "Skating Boarding Dog";

var queryURL = "https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.search.list?" + 
       "part=snippet" +
        "&order=viewCount" +
        "&q=" + encodeURI(search) +
        "&type=video" + 
        "&videoDefinition=high";

$.ajax({
		url: queryURL, 
		method: 'GET'
}).done(createSearchResults);