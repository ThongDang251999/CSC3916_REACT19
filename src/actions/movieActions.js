import actionTypes from '../constants/actionTypes';
//import runtimeEnv from '@mars/heroku-js-runtime-env'
const env = process.env;

// For debugging
console.log('API URL:', env.REACT_APP_API_URL);

function moviesFetched(movies) {
    return {
        type: actionTypes.FETCH_MOVIES,
        movies: movies
    }
}

function movieFetched(movie) {
    return {
        type: actionTypes.FETCH_MOVIE,
        selectedMovie: movie
    }
}

function movieSet(movie) {
    return {
        type: actionTypes.SET_MOVIE,
        selectedMovie: movie
    }
}

function reviewSubmitted() {
    return {
        type: actionTypes.SUBMIT_REVIEW,
        result: true
    }
}

function moviesSearched(movies) {
    return {
        type: actionTypes.SEARCH_MOVIES,
        searchResults: movies
    }
}

function fetchMoviesRequest() {
    return {
        type: actionTypes.FETCH_MOVIES_REQUEST
    }
}

function fetchMoviesError(error) {
    return {
        type: actionTypes.FETCH_MOVIES_ERROR,
        error
    }
}

function fetchMovieRequest() {
    return {
        type: actionTypes.FETCH_MOVIE_REQUEST
    }
}

function fetchMovieError(error) {
    return {
        type: actionTypes.FETCH_MOVIE_ERROR,
        error
    }
}

export function setMovie(movie) {
    return dispatch => {
        dispatch(movieSet(movie));
    }
}

export function fetchMovie(movieId) {
    console.log('Fetching movie details for:', movieId);
    return dispatch => {
        dispatch(fetchMovieRequest());
        
        return fetch(`${env.REACT_APP_API_URL}/movies/${movieId}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            console.log('Movie details response:', response.status);
            if (!response.ok) {
                throw new Error(response.statusText || 'Failed to fetch movie details');
            }
            return response.json()
        }).then((res) => {
            console.log('Movie details received:', res);
            dispatch(movieFetched(res));
            return res;
        }).catch((e) => {
            console.error('Error fetching movie details:', e);
            dispatch(fetchMovieError(e.message));
            throw e;
        });
    }
}

export function fetchMovies() {
    console.log('Fetching movies list with reviews=true');
    return dispatch => {
        dispatch(fetchMoviesRequest());
        
        return fetch(`${env.REACT_APP_API_URL}/movies?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            console.log('Movies list response:', response.status);
            if (!response.ok) {
                throw new Error(response.statusText || 'Failed to fetch movies');
            }
            return response.json()
        }).then((res) => {
            console.log('Movies received:', res);
            dispatch(moviesFetched(res));
            return res;
        }).catch((e) => {
            console.error('Error fetching movies:', e);
            dispatch(fetchMoviesError(e.message));
            throw e;
        });
    }
}

export function searchMovies(searchTerm, searchType = 'title') {
    console.log('Searching movies:', searchTerm, 'by', searchType);
    return dispatch => {
        dispatch({ type: actionTypes.SEARCH_MOVIES_REQUEST });
        
        return fetch(`${env.REACT_APP_API_URL}/movies/search`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                searchTerm: searchTerm,
                searchType: searchType
            }),
            mode: 'cors'
        }).then((response) => {
            console.log('Search response:', response.status);
            if (!response.ok) {
                throw new Error(response.statusText || 'Failed to search movies');
            }
            return response.json()
        }).then((res) => {
            console.log('Search results:', res);
            dispatch(moviesSearched(res));
            return res;
        }).catch((e) => {
            console.error('Error searching movies:', e);
            dispatch({ 
                type: actionTypes.SEARCH_MOVIES_ERROR, 
                error: e.message 
            });
            throw e;
        });
    }
}

export function submitReview(reviewData) {
    console.log('Submitting review:', reviewData);
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                movieId: reviewData.movieId,
                rating: reviewData.rating,
                review: reviewData.comment
            }),
            mode: 'cors'
        }).then((response) => {
            console.log('Review submission response:', response.status);
            if (!response.ok) {
                throw new Error(response.statusText || 'Failed to submit review');
            }
            return response.json()
        }).then((res) => {
            console.log('Review submitted successfully:', res);
            dispatch(reviewSubmitted());
            // We don't need to fetch the movie again here as we'll use the callback in the component
            return res;
        }).catch((e) => {
            console.error('Error submitting review:', e);
            throw e;
        });
    }
}