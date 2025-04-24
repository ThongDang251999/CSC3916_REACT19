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
        // Remove duplicate movies based on title
        if (!movies) return [];
        
        // Use a Map to keep only one movie with each title
        const uniqueMovies = new Map();
        movies.forEach(movie => {
            // Only add the movie if we don't already have one with this title
            // Or if this movie has a higher rating than the existing one
            const existingMovie = uniqueMovies.get(movie.title);
            if (!existingMovie || (movie.avgRating > existingMovie.avgRating)) {
                uniqueMovies.set(movie.title, movie);
            }
        });
        
        // Convert the Map values back to an array
        return Array.from(uniqueMovies.values());
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

    // Test movie data for when API doesn't return data
    const testMovies = [{
        _id: '65ffaf0cbb45d068a11edd6a',  // Changed from 'test-movie'
        title: 'Guardians of the Galaxy',
        releaseDate: '2014',
        genre: 'Action/Sci-Fi',
        avgRating: 5,
        imageUrl: 'https://ichef.bbci.co.uk/images/ic/1200x675/p061d1pl.jpg'
    }];

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

    // Display error and the test movie card
    if (error) {
        return (
            <div>
                <Alert variant="danger" className="text-center p-5">Error loading movies: {error}</Alert>
                <div className="movie-list-container py-4">
                    <h2 className="text-center mb-4">Test Movie (Local Only)</h2>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        <Col>
                            <Card 
                                className="movie-card h-100 bg-dark text-white" 
                                as={Link} 
                                to={`/movie/65ffaf0cbb45d068a11edd6a`}
                                onClick={() => handleClick(testMovies[0])}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="movie-card-img-container">
                                    <Card.Img 
                                        variant="top" 
                                        src={testMovies[0].imageUrl} 
                                        alt={testMovies[0].title}
                                        className="movie-card-img"
                                        onError={(e) => {
                                            console.error(`Failed to load image: ${testMovies[0].imageUrl}`);
                                            e.target.onerror = null;
                                            e.target.src = 'https://ichef.bbci.co.uk/images/ic/1200x675/p061d1pl.jpg';
                                        }}
                                    />
                                </div>
                                <Card.Body className="text-center">
                                    <Card.Title>{testMovies[0].title}</Card.Title>
                                    <Card.Text className="d-flex justify-content-between align-items-center">
                                        <small>{testMovies[0].releaseDate}</small>
                                        <span className="d-flex align-items-center">
                                            <BsStarFill className="text-warning me-1" /> 
                                            {testMovies[0].avgRating ? Number(testMovies[0].avgRating).toFixed(1) : 'N/A'}
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

    // If no movies from API, show test movie
    if (!memoizedMovies || memoizedMovies.length === 0) {
        return (
            <div className="movie-list-container py-4">
                <h2 className="text-center mb-4">Test Movie (Local Only)</h2>
                <p className="text-center text-muted mb-4">No movies found in API, showing test movie</p>
                <Row xs={1} md={2} lg={3} className="g-4">
                    <Col>
                        <Card 
                            className="movie-card h-100 bg-dark text-white" 
                            as={Link} 
                            to={`/movie/65ffaf0cbb45d068a11edd6a`}
                            onClick={() => handleClick(testMovies[0])}
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="movie-card-img-container">
                                <Card.Img 
                                    variant="top" 
                                    src={testMovies[0].imageUrl} 
                                    alt={testMovies[0].title}
                                    className="movie-card-img"
                                    onError={(e) => {
                                        console.error(`Failed to load image: ${testMovies[0].imageUrl}`);
                                        e.target.onerror = null;
                                        e.target.src = 'https://ichef.bbci.co.uk/images/ic/1200x675/p061d1pl.jpg';
                                    }}
                                />
                            </div>
                            <Card.Body className="text-center">
                                <Card.Title>{testMovies[0].title}</Card.Title>
                                <Card.Text className="d-flex justify-content-between align-items-center">
                                    <small>{testMovies[0].releaseDate}</small>
                                    <span className="d-flex align-items-center">
                                        <BsStarFill className="text-warning me-1" /> 
                                        {testMovies[0].avgRating ? Number(testMovies[0].avgRating).toFixed(1) : 'N/A'}
                                    </span>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
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
                                    src={movie.imageUrl || 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg'} 
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