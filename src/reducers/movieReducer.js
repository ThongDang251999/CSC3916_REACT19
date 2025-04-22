import constants from '../constants/actionTypes'

let initialState = {
      movies: [],
      selectedMovie: null,
      loading: false,
      error: null,
      reviewSubmitted: false,
      searchResults: [],
      searching: false
}

const movieReducer = (state = initialState, action) => {
      let updated = Object.assign({}, state);

      switch(action.type) {
            case constants.FETCH_MOVIES:
                  updated['movies'] = action.movies;
                  updated['selectedMovie'] = action.movies[0];
                  updated['loading'] = false;
                  updated['error'] = null;
                  return updated;
            case constants.SET_MOVIE:
                  updated['selectedMovie'] = action.selectedMovie;
                  updated['loading'] = false;
                  updated['error'] = null;
                  return updated;
            case constants.FETCH_MOVIE:
                  updated['selectedMovie'] = action.selectedMovie;
                  updated['loading'] = false;
                  updated['error'] = null;
                  return updated;
            case constants.SUBMIT_REVIEW:
                  updated['reviewSubmitted'] = true;
                  return updated;
            case constants.SEARCH_MOVIES_REQUEST:
                  updated['searching'] = true;
                  updated['loading'] = true;
                  updated['error'] = null;
                  return updated;
            case constants.SEARCH_MOVIES:
                  updated['searchResults'] = action.searchResults;
                  updated['searching'] = false;
                  updated['loading'] = false;
                  updated['error'] = null;
                  return updated;
            case constants.SEARCH_MOVIES_ERROR:
                  updated['error'] = action.error;
                  updated['searching'] = false;
                  updated['loading'] = false;
                  return updated;
            default:
                  return state;
      }
}

export default movieReducer;