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
        
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        
        return fetch(`${env.REACT_APP_API_URL}/movies/${movieId}?reviews=true&_t=${timestamp}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                'Cache-Control': 'no-cache, no-store'
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
            console.log('Image URL from API:', res.imageUrl);
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
    console.log('API URL:', env.REACT_APP_API_URL);
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
            console.log('Movies list response status:', response.status);
            console.log('Movies list response headers:', [...response.headers.entries()]);
            if (!response.ok) {
                console.error('Error response:', response);
                return response.text().then(text => {
                    console.error('Error response body:', text);
                    let errorMessage = `Failed to fetch movies (Status: ${response.status})`;
                    let errorDetails = '';
                    
                    try {
                        const errorJson = JSON.parse(text);
                        if (errorJson.message || errorJson.error) {
                            errorMessage = errorJson.message || errorJson.error;
                            errorDetails = errorJson.details || '';
                        }
                    } catch (e) {
                        // If parsing fails, use the text as the error message if it exists
                        if (text) errorMessage = text;
                    }
                    
                    const error = new Error(errorMessage);
                    error.status = response.status;
                    error.errorDetails = errorDetails;
                    throw error;
                });
            }
            return response.json()
        }).then((res) => {
            console.log('Movies received (count):', res ? res.length : 0);
            console.log('Movies data sample:', res && res.length > 0 ? res[0] : 'No movies returned');
            dispatch(moviesFetched(res));
            return res;
        }).catch((e) => {
            console.error('Error fetching movies (details):', e);
            console.error('Error message:', e.message);
            console.error('Error status:', e.status);
            console.error('Error details:', e.errorDetails);
            dispatch(fetchMoviesError({
                message: e.message,
                status: e.status,
                details: e.errorDetails
            }));
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
    console.log('API URL for review submission:', `${env.REACT_APP_API_URL}/reviews`);
    console.log('Token for auth:', localStorage.getItem('token') ? 'Token exists' : 'No token found');
    
    // Ensure the review field name matches what the backend expects
    const requestBody = {
        movieId: reviewData.movieId,
        rating: reviewData.rating,
        review: reviewData.comment || '' // Ensure proper field mapping
    };
    
    console.log('Request body for review:', requestBody);
    
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(requestBody),
            mode: 'cors'
        }).then((response) => {
            console.log('Review submission response status:', response.status);
            console.log('Review submission response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Error response body:', text);
                    let errorMessage;
                    try {
                        const errorJson = JSON.parse(text);
                        errorMessage = errorJson.message || errorJson.error || `HTTP Error ${response.status}`;
                    } catch (e) {
                        errorMessage = text || `HTTP Error ${response.status}`;
                    }
                    throw new Error(errorMessage);
                });
            }
            return response.json();
        }).then((res) => {
            console.log('Review submitted successfully:', res);
            dispatch(reviewSubmitted());
            return res;
        }).catch((e) => {
            console.error('Error submitting review (details):', e);
            console.error('Error message:', e.message);
            throw e;
        });
    }
}

export function fetchMovieReviews(movieId) {
    console.log('Fetching reviews for movie:', movieId);
    return dispatch => {
        // Try the endpoint that matches your HW4 API structure 
        return fetch(`${env.REACT_APP_API_URL}/movies/${movieId}/reviews`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        }).then((response) => {
            console.log('Reviews response:', response.status);
            if (!response.ok) {
                // Fall back to the alternative endpoint structure if the first one fails
                console.log('First endpoint failed, trying alternate endpoint');
                return fetch(`${env.REACT_APP_API_URL}/reviews?movieId=${movieId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    mode: 'cors'
                }).then(altResponse => {
                    if (!altResponse.ok) {
                        throw new Error(altResponse.statusText || 'Failed to fetch reviews from both endpoints');
                    }
                    return altResponse.json();
                });
            }
            return response.json();
        }).then((res) => {
            console.log('Reviews received:', res);
            
            // Normalize the response structure
            let normalizedReviews = res;
            
            // Check if the response is an array of reviews directly
            if (Array.isArray(res)) {
                normalizedReviews = res;
            } 
            // Check if the response has a 'reviews' property that is an array
            else if (res && Array.isArray(res.reviews)) {
                normalizedReviews = res.reviews;
            }
            
            // Update the movie with these reviews
            dispatch({
                type: actionTypes.FETCH_REVIEWS,
                reviews: normalizedReviews
            });
            return normalizedReviews;
        }).catch((e) => {
            console.error('Error fetching reviews:', e);
            // If all else fails, dispatch an empty reviews array to avoid UI errors
            dispatch({
                type: actionTypes.FETCH_REVIEWS,
                reviews: []
            });
            throw e;
        });
    }
}