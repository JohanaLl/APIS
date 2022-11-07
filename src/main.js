const api = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
})

//UTILITIES
function createMovies(container, movies) {
    container.innerHTML = "";
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src', 
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path
        );

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer)
    });
}

function createCategories(container, categories) {
    container.innerHTML = "";

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => location.hash = `#category=${category.id}-${category.name}`)
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

//LLAMADO API
async function getTrendingMoviesPreview() {
    const { data } = await api.get('trending/movie/day');
    const movies = data.results;
    createMovies(trendingMoviesPreviewList, movies);
}

async function getCategoriesPreview () {
    const { data } = await api.get('genre/movie/list')
    const categories = data.genres;
    createCategories(categoriesPreviewList, categories);
}

async function getMoviesByCategory(id) {
    const { data } = await api.get('discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    createMovies(genericSection, movies);
}

async function getMoviesBySearch(query) {
    const { data } = await api.get('search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;
    createMovies(genericSection, movies);
}

async function getTrendingMovies() {
    const { data } = await api.get('trending/movie/day');
    const movies = data.results;
    createMovies(genericSection, movies);
}

async function getMovieById(id) {
    const { data: movie } = await api.get('movie/' + id);
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path;
    console.log(movieImgUrl);
    headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})
    `;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movieDetailCategoriesList, movie.genres);
    getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id) {
    const { data } = await api.get(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMoviesContainer, relatedMovies);

}

