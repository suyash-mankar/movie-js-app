const outerContainer = document.getElementById("outer-container");

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

async function addMovieToDom() {
  outerContainer.innerHTML = "";
  const movieName = localStorage.getItem("movieName");
  const data = await fetchMovie(movieName);
  const movieContainer = document.createElement("div");
  console.log(data);
  movieContainer.setAttribute("class", "movie-container");

  movieContainer.innerHTML = `
        <div class="heading">
          <h1>${data.Title}</h1>
          <p>${data.Year}</p>
          <p>${data.Runtime}</p>
          <p>Rating</p>
          <p>${data.imdbRating}/10</p>
        </div>

        <div class="movie-info-container">
          <img src="${data.Poster}" alt="poster" />
          <div class="movie-details">
            <h4>Plot</h4>
            <p>${data.Plot}</p>
            <p>Directors: ${data.Director}</p>
            <p>Cast: ${data.Actors}</p>
            <p>Genre: ${data.Genre}</p>
          </div>
        </div>
  `;

  outerContainer.append(movieContainer);
}

addMovieToDom();
