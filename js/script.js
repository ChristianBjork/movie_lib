/**  
* @author  Christian Bjørk Christiansen
* @version 1.0 Oktober 2020
*/

$(document).ready(function() {
    console.log("ready doc");
    $('.movieContainer').hide();
    $(".modal").hide();
    $("#btn-search").click(function() { 

        let searchOpt = $('#searchOption').val();
        let searchYear = $("#searchValueYear").val();

        if (searchYear !=='' && searchOpt === 'movie') {
            console.log("counting year");
            movieYearSearch();
        } else if (searchOpt === 'movie') {
            console.log("Counting without year")
            movieSearch();
        } else if (searchOpt === 'person') {
            console.log("here")
            personSearch();
        }
    });
});

function movieYearSearch(){
    let searchYear = $("#searchValueYear").val();
    let URL = 'https://api.themoviedb.org/3/search/' + $('#searchOption').val() + '?api_key=' + movieAPIKey + '&language=en-US&page=1&include_adult=false&query=' + $('#searchValue').val();
    var movieRelease = '';
    $.ajax({
        url: URL,
        type: "GET"
    }).done(function(data){
        data.results.forEach(element => {
            if (element.release_date === searchYear) {
                movieRelease += '<div class="movie result-info-box">'
                movieRelease += '<span hidden id="id">' + element.id + '</span>'
                movieRelease += 'Title: <span id="title">' + element.title + '</span>' + '<br>';
                movieRelease += 'Release Date: <span id="release-date">' + element.release_date + '</span>' + '<br>';
                movieRelease += '</div>'
            }
        });
        $('.resultContainer').html(movieRelease);
        $('.resultContainer').show();
        showMovieModal();
    });
}

function personSearch() {
    let URL = 'https://api.themoviedb.org/3/search/' + $('#searchOption').val() + '?api_key=' + movieAPIKey + '&language=en-US&page=1&include_adult=false&query=' + $('#searchValue').val();
    let personResults = '';
    $.ajax({
        url: URL,
        type: "GET"
    }).done(function(data) {
        console.log(data.results[0].name);
        data.results.forEach(element => {
            personResults += '<div class="person result-info-box">';
                personResults += '<span hidden id="id">' + element.id + '</span>'
                personResults += 'Name: <span id="name">' + element.name +'</span> <br>';
                personResults += 'Main Activity: <span id="main-activity">' + element.known_for_department + '</span>';
            personResults += '</div>'
        });
        $('.resultContainer').html(personResults);
        $('.resultContainer').show();
        showPersonModal();
    });
}

//Used inside personSearch()
function showPersonModal() {
    $('.person').click(function() {
        let id = $(this).find('#id').text();
        let URL = 'https://api.themoviedb.org/3/person/' + id + '?api_key=' + movieAPIKey + '&language=en-US';
        $.ajax({
            url: URL,
            type: "GET"
        }).done(function(data) {
            $('#modalName').html(data.name);
            $('#modalMainActivity').html(data.known_for_department);
            $('#modalBirthday').html(data.birthday);
            $('#modalBirthPlace').html(data.place_of_birth);
            if (data.deathday !== null) {
                $('#modalDeceased').html('Day of decease: ' + data.deathday)
            }
            $('#modalBio').html(data.biography);
            $('#modalWebsite').html(data.homepage);
        });

        URL = 'https://api.themoviedb.org/3/person/' + id + '/movie_credits?api_key=' + movieAPIKey + '&language=en-US';
        let movieInfo = '';
        $.ajax({
            url: URL,
            type: "GET"
        }).done(function (data){
            data.cast.forEach(element => {
                movieInfo += '<li>Title: ' + element.title + '</li>';
                movieInfo += '<li>Release Year: ' + element.release_date + '</li>'
                movieInfo += '<li>Role: ' + element.character + '</li><br>'
            });
            $('#movie-info').html(movieInfo);
        });
        $(".personModal").css("display","block");
        $("#closePerson").on("click", function (){
            $(".personModal").css("display", "none");
        });
    });
}


function movieSearch() {
    let URL = 'https://api.themoviedb.org/3/search/' + $('#searchOption').val() + '?api_key=' + movieAPIKey + '&language=en-US&page=1&include_adult=false&query=' + $('#searchValue').val();
    let movieResults = '';
    $.ajax({
        url: URL,
        type: "GET"
    }).done(function(data){
        data.results.forEach(element => {
            movieResults += '<div class="movie result-info-box">';
                movieResults += '<span hidden id="id">' + element.id + '</span>'
                movieResults += 'Title: <span id="title">' + element.title +'</span><br>';
                movieResults += 'Release Date: <span id="release-date">' + element.release_date + '</span><br>';
                movieResults += 'Language: <span id="language">' + element.original_language +'</span>';
            movieResults += '</div>'
        });
        $('.resultContainer').html(movieResults);
        $('.resultContainer').show();
        showMovieModal();
    });
}

//Used inside movieSearch()
function showMovieModal(){
    $('.movie').click(function(){
        let id = $(this).find('#id').text();
        let URL = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + movieAPIKey + '&language=en-US';
        $.ajax({
            url: URL,
            type: "GET"
        }).done(function(data){
            $('#modalTitle').html(data.title);
            $('#modalRelease-date').html(data.release_date);
            $('#modalLanguage').html(data.original_language);
            $('#modalRuntime').html(data.runtime + " minutes");
            $('#modalOverview').html(data.overview);
            $('#modalLink').html(data.link);
            let genres ='';
            data.genres.forEach(element => {
                genres += '<li>' + element.name + '</li>'
            });
            $('#modalGenres').html(genres);
        });
        let creditsURL = 'https://api.themoviedb.org/3/movie/' + id + '/credits?api_key=' + movieAPIKey + '&language=en-US';
        $.ajax({
            url: creditsURL,
            type: "GET"
        }).done(function(data){
            let actors = '';
            data.cast.forEach(element => {
                actors += '<li>Name: ' + element.name + '</li>';
                actors += '<li>Character: ' + element.character + '</li><br>';
            });
            $('#modalActors').html(actors);

            let directors = '';
            data.crew.forEach(element => {
                if (element.job == 'Director') {
                    directors += '<li>' + element.name + '</li>';
                }
            });
            if(directors == '') directors += "No directors were assigned for this movie";
            $('#modalDirectors').html(directors);

            let scriptWriters = '';
            data.crew.forEach(element => {
                if (element.job == 'Writer') {
                    console.log("writer: " + element.name);
                    scriptWriters += '<li>'+ element.name + '</li>';
                }
            });
            if(scriptWriters == '') {
                scriptWriters += "No script writers were assigned for this movie";
            }
            $('#modalScriptWriters').html(scriptWriters);

            let executive_producers = '';
            data.crew.forEach(element => {
                if (element.job ==="Executive Producer"){
                    executive_producers += '<li>' + element.name + '</li>'
                }
            });
            if(executive_producers == '') {
                executive_producers += "No executive_producers were assigned for this movie";
            }
            $('#modalExecutives').html(executive_producers);

            let producers = '';
            data.crew.forEach(element => {
                if (element.job ==="Producer"){
                    producers += '<li>' + element.name + '</li>'
                }
            });
            if(producers == '') {
                producers += "No producers were assigned for this movie";
            }
            $('#modalProducers').html(producers);

            let composers = '';
            data.crew.forEach(element => {
                if (element.job ==="Original Music Composer"){
                    composers += '<li>' + element.name + '</li>'
                }
            });
            if(composers == '') {
                composers += "No composers were assigned for this movie";
            }
            $('#modalComposers').html(composers);

        });

        $(".movieModal").css("display","block");
        $("#closeMovie").on("click", function (){
            $(".movieModal").css("display", "none");
        });
    });
}