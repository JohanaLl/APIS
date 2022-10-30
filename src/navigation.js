window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

function navigator() {
    console.log({ location });

    if (location.hash.startsWith('#trends')) {
        trendPage();
    } else if (location.hash.startsWith('#search=')){
        searchPage();
    } else if (location.hash.startsWith('#movie=')){
        moviePage();
    } else if (location.hash.startsWith('#category=')){
        categoryPage();
    } else {
        homePage();
    }
}

function homePage() {
    console.log('Home!!');

    getTrendingMoviesPreview();
    getCategoriesPreview ();    
}

function categoryPage() {
    console.log('Categories!!');
}

function moviePage() {
    console.log('Movie!!');
}

function searchPage() {
    console.log('Search!!');
}

function trendPage() {
    console.log('TRENDS!!');
}
