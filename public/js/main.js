$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
});

function movieSelected(id) {
    console.log(id);
    sessionStorage.setItem('movieId', id);
    window.location = 'movie';
    return false;
}

function getMovie() {

    let movieId = sessionStorage.getItem('movieId');

    axios.get('http://www.omdbapi.com?i=' + movieId + '&apikey=852159f0').then((response) => {
        console.log(response);
        let movie = response.data;

        let output = `
        <div class="row">
            <div class="col-md-4">
                <img src="${movie.Poster}" class="thumbnail">
            </div>
            <div class="col-md-8">
                <h2>${movie.Title}</h2>
                <ul class="list-group">
                    <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                    <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                    <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                    <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                    <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                    <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                    <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                </ul>
            </div>
        </div>

        <div class="row">
        <div class="well">
          <h3>Plot</h3>
          ${movie.Plot}
          <hr>
          <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
          <a href="/users/movie_search" class="btn btn-default">Go Back To Search</a>


            <div class="btn favorite">
            <form method="post" action="/users/favorite">
                <input type="hidden" class="form-control" name="movieID" value="${movie.imdbID}">
                <input type="hidden" class="form-control" name="movieTitle" value="${movie.Title}">
                <input type="hidden" class="form-control" name="moviePoster" value="${movie.Poster}">
                <input type="hidden" class="form-control" name="movieGenre" value="${movie.Genre}">
                <input type="hidden" class="form-control" name="movieReleaseDate" value="${movie.Released}">
                <input type="hidden" class="form-control" name="movieRating" value="${movie.Rated}">
                <input type="hidden" class="form-control" name="movieImdbRating" value="${movie.imdbRating}">
                <input type="hidden" class="form-control" name="movieDirector" value="${movie.Director}">
                <input type="hidden" class="form-control" name="movieWriter" value="${movie.Writer}">
                <input type="hidden" class="form-control" name="movieActors" value="${movie.Actors}">
                <input type="hidden" class="form-control" name="moviePlot" value="${movie.Plot}">
                <button type="submit" class="btn btn-primary">Add Favorite</button>
            </form>
            </div>



        </div>
      </div>
        
        
        `;
    $('#movie').html(output);
    }).catch((err) => {
        console.log(err);
    });

}

function getMovies(searchText) {
    axios.get('http://www.omdbapi.com?s=' + searchText + '&apikey=852159f0').then((response) => {
        console.log(response);
        let movies = response.data.Search;
        let output = '';
        $.each(movies, (index, movie) => {
            output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}">
                        <p>${movie.Title}</p>
                        <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
                    </div>
                </div>
            `;
        });
        $('#movies').html(output);
    }).catch((err) => {
        console.log(err);
    });

}

function getFavorites() {
    console.log(favoriteList);

    console.log('getFavorites triggered');


    axios.get('http://www.omdbapi.com?s=' + searchText + '&apikey=852159f0').then((response) => {
        console.log(response);
        let movies = response.data.Search;
        let output = '';
        $.each(movies, (index, movie) => {
            output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}">
                        <p>${movie.Title}</p>
                        <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
                    </div>
                </div>
            `;
        });
        $('#movies').html(output);
    }).catch((err) => {
        console.log(err);
    });

}
