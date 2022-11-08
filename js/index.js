const searchResultsContainer = document.getElementById("search-results");
const searchText = document.getElementsByTagName("input")[0];
const favouriteListContainer = document.getElementById("favourite-list");
let movies = [];
let favList = [];

addFavouriteToDOM();

searchText.onkeyup = function (e) {
  async function getMovies() {
    let data = await fetchMovie(e.target.value);
    addSearchResultsToDom(data);
  }
  getMovies();
};

async function fetchMovie(searchText) {
  const url = `http://www.omdbapi.com/?i=tt3896198&apikey=49e67bb9&t=${searchText}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return;
  }
}

function addSearchResultsToDom(data) {
  let isPresent = false;
  if (data.Title === "undefined" || data.Response === "False") {
    return;
  }

  movies.forEach((movie) => {
    if (movie.Title == data.Title) {
      isPresent = true;
    }
  });

  if (!isPresent) {
    movies.push(data);
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
    searchResultsContainer.prepend(movieCard);
  }

  if (searchText.value === "") {
    searchResultsContainer.innerHTML = "";
  }
}

function addFavouriteToDOM() {
  favouriteListContainer.innerHTML = "";
  let favouriteMoviesList = JSON.parse(localStorage.getItem("favMovieList"));
  if (favouriteMoviesList) {
    favouriteMoviesList.map((movie) => {
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
      favouriteListContainer.prepend(favouriteCard);
    });
  }
}

async function handleAddFavoutiteBtn(e) {
  const target = e.target;
  const data = await fetchMovie(target.dataset.id);

  let moviesArrayFromLocalStorage = JSON.parse(
    localStorage.getItem("favMovieList")
  );

  if (moviesArrayFromLocalStorage) {
    favList = moviesArrayFromLocalStorage;
  }

  let isMoviePresentInLocalStorage = false;

  favList.forEach((movie) => {
    if (movie.Title === data.Title) {
      isMoviePresentInLocalStorage = true;
    }
  });

  if (!isMoviePresentInLocalStorage) {
    favList.push(data);
    localStorage.setItem("favMovieList", JSON.stringify(favList));
    addFavouriteToDOM();
  }
}

function handleDeleteFavoutiteBtn(e) {
  const target = e.target;
  const movieTitle = target.dataset.id;

  let favList = JSON.parse(localStorage.getItem("favMovieList"));

  let updatedList = favList.filter((movie) => {
    return movie.Title != movieTitle;
  });

  localStorage.setItem("favMovieList", JSON.stringify(updatedList));

  favouriteListContainer.innerHTML = "";
  addFavouriteToDOM();
}

function handleClick(e) {
  const target = e.target;
  if (target.classList.contains("add-favourite")) {
    e.preventDefault();
    handleAddFavoutiteBtn(e);
  } else if (target.classList.contains("fa-trash")) {
    e.preventDefault();
    handleDeleteFavoutiteBtn(e);
  }

  localStorage.setItem("movieName", target.dataset.id);
}

document.addEventListener("click", handleClick);