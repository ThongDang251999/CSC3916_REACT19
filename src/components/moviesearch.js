import React, { useState } from 'react';
import { Form, Button, InputGroup, Card, Row, Col, Accordion } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies, setMovie } from '../actions/movieActions';
import { Link } from 'react-router-dom';
import { BsStarFill, BsSearch } from 'react-icons/bs';

const MovieSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title'); // 'title' or 'actor'
  const dispatch = useDispatch();
  const searchResults = useSelector(state => state.movie.searchResults);
  const loading = useSelector(state => state.movie.loading);
  const error = useSelector(state => state.movie.error);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchMovies(searchTerm, searchType));
    }
  };

  const handleMovieSelect = (movie) => {
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

  return (
    <div className="search-container mb-5">
      <h3 className="mb-3">Search Movies</h3>
      <Form onSubmit={handleSearch}>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search for movies or actors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search term"
          />
          <Form.Select 
            style={{ maxWidth: '150px' }}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="title">By Title</option>
            <option value="actor">By Actor</option>
          </Form.Select>
          <Button variant="primary" type="submit">
            <BsSearch /> Search
          </Button>
        </InputGroup>
      </Form>

      {loading && <p className="text-center">Searching...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {searchResults && searchResults.length > 0 ? (
        <div className="results-container mt-4">
          {/* Grid View */}
          <Row xs={1} md={2} lg={3} className="g-4 mb-4">
            {searchResults.map(movie => (
              <Col key={movie._id}>
                <Card className="h-100 bg-dark text-white">
                  <Card.Img 
                    variant="top" 
                    src={movie.imageUrl || 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg'} 
                    alt={movie.title}
                    className="search-movie-img"
                  />
                  <Card.Body>
                    <Card.Title>
                      <Link 
                        to={`/movie/${movie._id}`} 
                        className="text-white text-decoration-none"
                        onClick={() => handleMovieSelect(movie)}
                      >
                        {movie.title}
                      </Link>
                    </Card.Title>
                    <Card.Text>
                      <small>{movie.releaseDate}</small>
                      <div>
                        <BsStarFill className="text-warning" /> {movie.avgRating ? movie.avgRating.toFixed(1) : 'No ratings'}
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Accordion View */}
          <Accordion className="mb-4">
            {searchResults.map((movie, index) => (
              <Accordion.Item eventKey={index.toString()} key={movie._id} className="bg-dark text-white">
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span>{movie.title} ({movie.releaseDate})</span>
                    <span><BsStarFill className="text-warning me-1" /> {movie.avgRating ? movie.avgRating.toFixed(1) : 'N/A'}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={4}>
                      <img 
                        src={movie.imageUrl || 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg'} 
                        alt={movie.title}
                        className="img-fluid mb-2"
                      />
                    </Col>
                    <Col md={8}>
                      <h5>Cast:</h5>
                      <ul>
                        {movie.actors && movie.actors.map((actor, i) => (
                          <li key={i}>{actor.actorName} as {actor.characterName}</li>
                        ))}
                      </ul>
                      <Link 
                        to={`/movie/${movie._id}`}
                        className="btn btn-primary"
                        onClick={() => handleMovieSelect(movie)}
                      >
                        View Details
                      </Link>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      ) : (
        searchTerm && !loading && <p className="text-center">No results found</p>
      )}
    </div>
  );
};

export default MovieSearch; 