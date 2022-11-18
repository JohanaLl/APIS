const api = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
        'language': navigator.language || "es-ES",
    },
})

/**Lenguaje de la aplicación */
const lang = navigator.language.split('-')[0];

/**Devuelve el objeto de películas guardadas en el local storage */
function likedMoviesList () {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies= {};
    }
    return movies
}

function likeMovie (movie) {
    const likedMovies = likedMoviesList();

    /**Si la pelicula esta en el local estorage se remueve, 
     * si no esta se agrega
     */
    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies))
}

//UTILITIES
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url)
        }
    });
});

function createMovies(
    container, 
    movies, 
    {
        lazyLoad = false, 
        clean = true,
    } = {},
) {
    if (clean) {
        container.innerHTML = "";
    }
    
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src', 
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path
        );
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src', 
                'https://nbcpalmsprings.com/wp-content/uploads/sites/8/2021/12/BEST-MOVIES-OF-2021.jpeg'
            );
        });
        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked')
            likeMovie(movie);
            getLikedMovies();
        })


        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }
        
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn)
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
    createMovies(trendingMoviesPreviewList, movies, true);
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
    maxPage = data.total_pages;

    createMovies(genericSection, movies, true);
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
        const scrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if (scrollBottom && pageIsNotMax) {
            page++;
            const { data } = await api.get('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;
            createMovies(
                genericSection, 
                movies, 
                { lazyLoad: true, clean: false },
            );
        }
    }
}

async function getMoviesBySearch(query) {
    const { data } = await api.get('search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(genericSection, movies);
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
    
        const scrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;
    
        if (scrollBottom && pageIsNotMax) {
            page++;
            const { data } = await api.get('search/movie', {
                params: {
                    query,
                    page,
                }
            });
            const movies = data.results;
            
            createMovies(
                genericSection, 
                movies, 
                { lazyLoad: true, clean: false },
            );
        }
    }
}

async function getTrendingMovies() {
    const { data } = await api.get('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(
        genericSection, 
        movies, 
        { lazyLoad: true, },
    );
}

async function getPaginatedTrendingMovies() {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    const scrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    if (scrollBottom && pageIsNotMax) {
        page++;
        const { data } = await api.get('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;
        createMovies(
            genericSection, 
            movies, 
            { lazyLoad: true, clean: false },
        );
    }
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

/**Funcion para consumir el local storage y agregarla a la sección */
function getLikedMovies() {
    /**obtener la lista de peliculas del local storage */
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);
    
    createMovies(likedMoviesListArticle, moviesArray, 
        { lazyLoad: true, clean: true, })

    console.log(moviesArray);
}