import constants from '../constants/actionTypes'

var initialState = {
      movies: [],
      selectedMovie: null,
      searchResults: [],
      loading: false,
      error: null,
      reviewSubmitted: false
}

export default (state = initialState, action) => {
      var updated = Object.assign({}, state);

      switch(action.type) {
            case constants.FETCH_MOVIES_REQUEST:
                  updated.loading = true;
                  updated.error = null;
                  return updated;
            case constants.FETCH_MOVIES:
                  updated.movies = action.movies;
                  updated.loading = false;
                  updated.error = null;
                  return updated;
            case constants.FETCH_MOVIES_ERROR:
                  updated.loading = false;
                  updated.error = action.error;
                  return updated;
            case constants.FETCH_MOVIE_REQUEST:
                  updated.loading = true;
                  updated.error = null;
                  return updated;
            case constants.FETCH_MOVIE:
                  updated.selectedMovie = action.selectedMovie;
                  updated.loading = false;
                  updated.error = null;
                  return updated;
            case constants.FETCH_MOVIE_ERROR:
                  updated.loading = false;
                  updated.error = action.error;
                  return updated;
            case constants.SET_MOVIE:
                  updated.selectedMovie = action.selectedMovie;
                  return updated;
            case constants.SUBMIT_REVIEW:
                  updated.reviewSubmitted = action.result;
                  return updated;
            case constants.FETCH_REVIEWS:
                  if (updated.selectedMovie) {
                        updated.selectedMovie = {
                              ...updated.selectedMovie,
                              reviews: action.reviews
                        };
                  }
                  return updated;
            case constants.SEARCH_MOVIES_REQUEST:
                  updated.loading = true;
                  updated.error = null;
                  return updated;
            case constants.SEARCH_MOVIES:
                  updated.searchResults = action.searchResults;
                  updated.loading = false;
                  updated.error = null;
                  return updated;
            case constants.SEARCH_MOVIES_ERROR:
                  updated.loading = false;
                  updated.error = action.error;
                  return updated;
            default:
                  return state;
      }
}