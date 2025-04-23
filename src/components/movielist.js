import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, setMovie } from "../actions/movieActions";
import { Link } from 'react-router-dom';
import { Image, Card, Row, Col, Alert } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movie.movies);
    const loading = useSelector(state => state.movie.loading);
    const error = useSelector(state => state.movie.error);
    const loggedIn = useSelector(state => state.auth.loggedIn);

    // Memoize the movies array
    const memoizedMovies = useMemo(() => {
        return movies;
    }, [movies]);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleClick = (movie) => {
        dispatch(setMovie(movie));
    };
    
    // Function to validate if a string is a valid URL
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Get image URL, either from direct URL or from backend path
    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300x450?text=No+Image';
        return isValidUrl(url) ? url : url;
    };

    if (!loggedIn) {
        return (
            <Alert variant="warning" className="text-center p-5">
                Please <Alert.Link as={Link} to="/signin">log in</Alert.Link> to view movies.
            </Alert>
        );
    }

    if (loading) {
        return <div className="text-center p-5">Loading movies...</div>;
    }

    if (error) {
        return <Alert variant="danger" className="text-center p-5">Error: {error}</Alert>;
    }

    if (!memoizedMovies || memoizedMovies.length === 0) {
        return <div className="text-center p-5">No movies available.</div>;
    }

    return (
        <div className="movie-list-container py-4">
            <h2 className="text-center mb-4">Top Rated Movies</h2>
            <p className="text-center text-muted mb-4">Movies are sorted by average rating</p>
            <Row xs={1} md={2} lg={3} className="g-4">
                {memoizedMovies.map((movie) => (
                    <Col key={movie._id}>
                        <Card 
                            className="movie-card h-100 bg-dark text-white" 
                            as={Link} 
                            to={`/movie/${movie._id}`}
                            onClick={() => handleClick(movie)}
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="movie-card-img-container">
                                <Card.Img 
                                    variant="top" 
                                    src={movie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
                                    alt={movie.title}
                                    className="movie-card-img"
                                />
                            </div>
                            <Card.Body className="text-center">
                                <Card.Title>{movie.title}</Card.Title>
                                <Card.Text className="d-flex justify-content-between align-items-center">
                                    <small>{movie.releaseDate}</small>
                                    <span className="d-flex align-items-center">
                                        <BsStarFill className="text-warning me-1" /> 
                                        {movie.avgRating ? Number(movie.avgRating).toFixed(1) : 'N/A'}
                                    </span>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default MovieList;