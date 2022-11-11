(function () {
  const searchResultsContainer = document.getElementById("search-results");
  const searchText = document.getElementsByTagName("input")[0];
  const favouriteListContainer = document.getElementById("favourite-list");

  // Array to store the search results
  let movies = [];
  // Array to store the favourite movies
  let favList = [];

  addFavouriteToDOM();

  // Event listner on search
  searchText.onkeyup = function (e) {
    async function getMovies() {
      // fetch the movie data
      let data = await fetchMovie(e.target.value);
      addSearchResultsToDom(data);
    }
    getMovies();
  };

  // function to fetch the data from API and return it
  async function fetchMovie(searchText) {
    const url = `https://www.omdbapi.com/?i=tt3896198&apikey=49e67bb9&t=${searchText}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      return;
    }
  }

  // function to show the search results on homepage
  function addSearchResultsToDom(data) {
    let isPresent = false;
    if (data.Title === "undefined" || data.Response === "False") {
      return;
    }

    // check if the movie is already present in the movies array
    movies.forEach((movie) => {
      if (movie.Title == data.Title) {
        isPresent = true;
      }
    });

    // if the movie is not already present
    if (!isPresent) {
      movies.push(data);

      // create a movie card element
      const movieCard = document.createElement("a");
      movieCard.setAttribute("id", "movie-card");
      movieCard.setAttribute("class", "card");
      movieCard.setAttribute("data-id", `${data.Title}`);
      movieCard.setAttribute("href", `movie.html`);

      movieCard.innerHTML = `
      <a href='movie.html'>
        <img id='poster' src="${data.Poster}" data-id='${data.Title}' alt="movie-poster" />
      </a>
      <div class="movie-details" data-id='${data.Title}'>
        <a href='movie.html'>
          <h4 data-id='${data.Title}'>${data.Title}</h4>
        </a>
          <p data-id='${data.Title}'> Genre : ${data.Genre} </p>
          <p data-id='${data.Title}'> Year : ${data.Year} </p>
          <p data-id='${data.Title}'> IMDB : <i class="fa-solid fa-star"></i> ${data.imdbRating} </p>
      </div>
      <button data-id="${data.Title}" class="add-favourite"> <i class="fa-regular fa-heart"></i> Add to Favourite</button>    
    `;

      // prepend the movie card element in the search results container
      searchResultsContainer.prepend(movieCard);
    }

    // if the input is empty -> clear the search results container
    if (searchText.value === "") {
      searchResultsContainer.innerHTML = "";
      movies = [];
    }
  }

  // function to add favourite movies to home page
  function addFavouriteToDOM() {
    favouriteListContainer.innerHTML = "";

    // get the favourite movie list from local storage
    let favouriteMoviesList = JSON.parse(localStorage.getItem("favMovieList"));
    if (favouriteMoviesList) {
      favouriteMoviesList.map((movie) => {
        // create a favourite card
        const favouriteCard = document.createElement("a");
        favouriteCard.setAttribute("class", "fav-card");
        favouriteCard.setAttribute("data-id", `${movie.Title}`);
        favouriteCard.setAttribute("href", `movie.html`);

        favouriteCard.innerHTML = `
        <a href='movie.html'>
          <img id='poster' src="${movie.Poster}" data-id='${movie.Title}' alt="movie-poster" />
        </a>
        <div class="movie-details" data-id='${movie.Title}'> 
        <a href='movie.html'>
          <p class="font-weight-bold" data-id='${movie.Title}'>${movie.Title}</p>
        </a>
            <p data-id='${movie.Title}'> Year : ${movie.Year} </p>
            <p data-id='${movie.Title}'> IMDB : <i class="fa-solid fa-star"></i> ${movie.imdbRating} </p>
        </div>
        <i class="fa-solid fa-trash" data-id="${movie.Title}"></i>    
      `;
        // prepend the favourite card element in the favourite List Container
        favouriteListContainer.prepend(favouriteCard);
      });
    }
  }

  // function to add the movie to favourites
  async function handleAddFavoutiteBtn(e) {
    const target = e.target;
    // fetch the data of the movie
    const data = await fetchMovie(target.dataset.id);

    // get the fav movies array from local storage
    let moviesArrayFromLocalStorage = JSON.parse(
      localStorage.getItem("favMovieList")
    );

    if (moviesArrayFromLocalStorage) {
      favList = moviesArrayFromLocalStorage;
    }

    let isMoviePresentInLocalStorage = false;

    // check if the movie is already present in the favList array
    favList.forEach((movie) => {
      if (movie.Title === data.Title) {
        isMoviePresentInLocalStorage = true;
      }
    });

    // if movie is not present in the array, push it
    if (!isMoviePresentInLocalStorage) {
      favList.push(data);
      // set the fav movie array in local storage
      localStorage.setItem("favMovieList", JSON.stringify(favList));
      addFavouriteToDOM();
    }
  }

  // function to delete the movie from favourites
  function handleDeleteFavoutiteBtn(e) {
    const target = e.target;
    const movieTitle = target.dataset.id;
    // get the fav movie array from local storage
    let favList = JSON.parse(localStorage.getItem("favMovieList"));
    // remove the movie to be deleted from the array
    let updatedList = favList.filter((movie) => {
      return movie.Title != movieTitle;
    });
    // set the array in the local storage
    localStorage.setItem("favMovieList", JSON.stringify(updatedList));
    // To refresh the favourite movie list in the home page
    favouriteListContainer.innerHTML = "";
    addFavouriteToDOM();
  }

  // Handles click events
  function handleClick(e) {
    const target = e.target;
    // If clicked on 'Add Favourite' button
    if (target.classList.contains("add-favourite")) {
      e.preventDefault();
      handleAddFavoutiteBtn(e);
      // If clicked on 'Delete' button
    } else if (target.classList.contains("fa-trash")) {
      e.preventDefault();
      handleDeleteFavoutiteBtn(e);
    }
    // Store the movie name from the data-id attribute of the element you clicked in local storage
    localStorage.setItem("movieName", target.dataset.id);
  }

  // Event listner on whole document
  document.addEventListener("click", handleClick);
})();
