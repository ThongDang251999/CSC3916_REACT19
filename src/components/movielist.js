import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, setMovie } from "../actions/movieActions";
import { Link } from 'react-router-dom';
import { Card, Row, Col, Alert, Container, Form, Button } from 'react-bootstrap';
import { BsStarFill, BsSearch } from 'react-icons/bs';
import { useState } from 'react';

function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movie.movies);
    const loading = useSelector(state => state.movie.loading);
    const error = useSelector(state => state.movie.error);
    const loggedIn = useSelector(state => state.auth.loggedIn);
    const [searchTerm, setSearchTerm] = useState("");

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

    // Filter movies based on search term
    const filteredMovies = useMemo(() => {
        if (!searchTerm.trim()) return memoizedMovies;
        
        const searchLower = searchTerm.toLowerCase();
        return memoizedMovies.filter(movie => {
            // Search by movie title
            if (movie.title && movie.title.toLowerCase().includes(searchLower)) {
                return true;
            }
            
            // Search by actor name
            if (movie.actors && movie.actors.length > 0) {
                return movie.actors.some(actor => 
                    actor.actorName && actor.actorName.toLowerCase().includes(searchLower) ||
                    actor.characterName && actor.characterName.toLowerCase().includes(searchLower)
                );
            }
            
            return false;
        });
    }, [memoizedMovies, searchTerm]);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleClick = (movie) => {
        dispatch(setMovie(movie));
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        // Search is handled via the filteredMovies variable
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
        return (
            <Alert variant="danger" className="text-center p-5">
                Error loading movies: {error}
            </Alert>
        );
    }

    if (!filteredMovies || filteredMovies.length === 0) {
        return (
            <Container className="py-4">
                <h2 className="text-center mb-4">Top Rated Movies</h2>
                
                {/* Search Form */}
                <Form onSubmit={handleSearch} className="mb-4">
                    <div className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder="Search movies or actors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="primary" type="submit" className="ms-2">
                            <BsSearch />
                        </Button>
                    </div>
                </Form>
                
                <Alert variant="info">
                    {searchTerm ? "No movies found matching your search." : "No movies available at this time."}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="movie-list-container py-4">
            <h2 className="text-center mb-4">Top Rated Movies</h2>
            
            {/* Search Form */}
            <Form onSubmit={handleSearch} className="mb-4">
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Search movies or actors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="primary" type="submit" className="ms-2">
                        <BsSearch />
                    </Button>
                </div>
            </Form>
            
            <p className="text-center text-muted mb-4">Movies are sorted by average rating</p>
            <Row xs={1} md={2} lg={3} className="g-4">
                {filteredMovies.map((movie) => (
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
                                    onError={(e) => {
                                        console.error(`Failed to load image: ${movie.imageUrl}`);
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/300x450?text=Image+Error';
                                    }}
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
        </Container>
    );
}

export default MovieList;