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
  movieContainer.setAttribute("class", "movie-container");

  movieContainer.innerHTML = `
        <div class="heading">
          <h1>${data.Title}</h1>

          
          <div class='year-runtime'>
            <p>${data.Year}</p>
            <p>${data.Runtime}</p>
          </div> 
          <div class='rating'>
            <p class='rating-heading'>Rating</p>
            <p> <i class="fa-solid fa-star"></i> ${data.imdbRating}/10</p>
          </div>
          
        </div>

        <div class="movie-info-container">
          <img src="${data.Poster}" alt="poster" />
          <div class="movie-details">
            <h4 class='bold'>Plot</h4>
            <p>${data.Plot}</p>
            <p class='color-yellow bold'>Directors : <span> ${data.Director} </span> </p>
            <p class='color-yellow bold'>Cast : <span> ${data.Actors} </span> </p>
            <p class='color-yellow bold'>Genre : <span> ${data.Genre} </span> </p>
          </div>
        </div>
  `;

  outerContainer.append(movieContainer);
}

addMovieToDom();
