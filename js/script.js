/**  
* @author  Christian Bjørk Christiansen
* @version 1.0 Oktober 2020
*/

$(document).ready(function() {
    console.log("ready doc");
    $('.movieContainer').hide();
    $(".modal").hide();

    // let URL = 'https://api.themoviedb.org/3/search/' + $('#searchOption').val() + '?api_key=' + movieAPIKey + '&language=en-US&page=1&include_adult=false&query=' + $('#searchValue').val();
    // let URL = 'https://api.themoviedb.org/3/search/movie?api_key=6c0865a99bb78ed962aff1244af9561f&language=en-US&page=1&include_adult=false&query=leonardo';
    
    
    $("#btn-search").click(function() {
        let URL = 'https://api.themoviedb.org/3/search/' + $('#searchOption').val() + '?api_key=' + movieAPIKey + '&language=en-US&page=1&include_adult=false&query=' + $('#searchValue').val();
        console.log("inside btn search");
        $.ajax({
            url: URL,
            type: "GET"
        }).done(function(data){
            movieHandler(data);
        });

    });
    
});

function movieHandler(data) {
    var movieResults = '';
    data.results.forEach(element => {
        movieResults += '<div class="movie movie-info-box">';
            movieResults += 'Title: <span id="title">' + element.title +'</span>';
            movieResults += 'Release Date: <span id="release-date">' + element.release_date + '</span>';
            movieResults += 'Language: <span id="language">' + element.original_language +'</span>';
        movieResults += '</div>'
        console.log("title: " + element.title);
    });
    $('.movieContainer').html(movieResults);
    $('.movieContainer').show();

    $('.movie').click(function(){
        console.log("tiiiitle" + data.results[0].title)
        let title = $(this).find('#title').text();
        console.log('this should be the fuucking title: ' + title)
        console.log("bjork")
        $(".modal").css("display","block");
        $("#close").on("click", function (){
                $(".modal").css("display", "none");
        });
    });
}