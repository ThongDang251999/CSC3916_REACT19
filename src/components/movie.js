import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie } from "../actions/movieActions";
import MovieDetail from "../components/moviedetail";

// support routing

function Movie() {
    const params = useParams();
    const movieId = params.movieId;
    const dispatch = useDispatch();
    const selectedMovie = useSelector(state => state.movie.selectedMovie);

    // Always fetch the movie data when component mounts or movieId changes
    useEffect(() => {
        console.log("Movie component mounted, fetching movie ID:", movieId);
        dispatch(fetchMovie(movieId));
    }, [dispatch, movieId]);

    // Debugging
    console.log("Current selected movie:", selectedMovie);
    
    return <MovieDetail movieId={movieId} />;
}

export default Movie;