import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, setMovie, searchMovies } from "../actions/movieActions";
import { Link } from 'react-router-dom';
import { Card, Row, Col, Alert, Container, Form, Button, Spinner } from 'react-bootstrap';
import { BsStarFill, BsSearch, BsX } from 'react-icons/bs';
import debounce from 'lodash/debounce';
import MovieImage from './MovieImage';

function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movie.movies);
    const loading = useSelector(state => state.movie.loading);
    const error = useSelector(state => state.movie.error);
    const loggedIn = useSelector(state => state.auth.loggedIn);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const searchResults = useSelector(state => state.movie.searchResults);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((term) => {
            if (term.trim()) {
                setIsSearching(true);
                dispatch(searchMovies(term))
                    .finally(() => setIsSearching(false));
            }
        }, 500),
        [dispatch]
    );

    // Handle search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setIsSearching(true);
            dispatch(searchMovies(searchTerm))
                .finally(() => setIsSearching(false));
        }
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm("");
        dispatch(fetchMovies());
    };

    // Use searchResults if searching, otherwise use movies
    const moviesToDisplay = searchTerm.trim() ? searchResults : movies;

    // Deduplicate by title and release year
    const memoizedMovies = useMemo(() => {
        if (!moviesToDisplay) return [];
        const uniqueMovies = new Map();
        moviesToDisplay.forEach(movie => {
            const key = `${movie.title}-${movie.releaseDate}`;
            if (!uniqueMovies.has(key)) {
                uniqueMovies.set(key, movie);
            }
        });
        return Array.from(uniqueMovies.values());
    }, [moviesToDisplay]);

    useEffect(() => {
        if (!searchTerm) {
            dispatch(fetchMovies());
        }
    }, [dispatch, searchTerm]);

    const handleClick = (movie) => {
        dispatch(setMovie(movie));
    };

    if (!loggedIn) {
        return (
            <Alert variant="warning" className="text-center p-5">
                Please <Alert.Link as={Link} to="/signin">log in</Alert.Link> to view movies.
            </Alert>
        );
    }

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="text-center p-5">
                Error loading movies: {error}
            </Alert>
        );
    }

    return (
        <Container className="movie-list-container py-4">
            <h2 className="text-center mb-4">Top Rated Movies</h2>
            
            {/* Enhanced Search Form */}
            <Form onSubmit={handleSearch} className="mb-4">
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Search movies or actors..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        className="search-input"
                    />
                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="ms-2"
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <BsSearch />
                        )}
                    </Button>
                    {searchTerm && (
                        <Button 
                            variant="outline-secondary" 
                            onClick={handleClearSearch}
                            className="ms-2"
                        >
                            <BsX />
                        </Button>
                    )}
                </div>
            </Form>
            
            <p className="text-center text-muted mb-4">Movies are sorted by average rating</p>
            
            {memoizedMovies.length === 0 ? (
                <Alert variant="info" className="text-center">
                    {searchTerm ? "No movies found matching your search." : "No movies available at this time."}
                </Alert>
            ) : (
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
                                    <MovieImage
                                        src={movie.imageUrl}
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
            )}
        </Container>
    );
}

export default MovieList;