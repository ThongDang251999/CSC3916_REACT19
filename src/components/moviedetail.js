import React, { useEffect } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Row, Col, Badge } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import ReviewForm from './reviewform';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading);
  const error = useSelector(state => state.movie.error);
  const loggedIn = useSelector(state => state.auth.loggedIn);

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const DetailInfo = () => {
    if (loading) {
      return <div className="text-center p-5">Loading movie details...</div>;
    }

    if (error) {
      return <div className="text-center p-5 text-danger">Error: {error}</div>;
    }

    if (!selectedMovie) {
      return <div className="text-center p-5">No movie data available.</div>;
    }

    return (
      <div className="movie-detail-container">
        <Card className="bg-dark text-white mb-4">
          <Card.Header className="bg-primary text-white">
            <h3>{selectedMovie.title} ({selectedMovie.releaseDate})</h3>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Image 
                  src={selectedMovie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
                  alt={selectedMovie.title}
                  fluid 
                  className="mb-3" 
                />
                <div className="text-center mb-3">
                  <h4>
                    <BsStarFill className="text-warning" /> {selectedMovie.avgRating ? selectedMovie.avgRating.toFixed(1) : 'No ratings'}
                  </h4>
                </div>
              </Col>
              <Col md={8}>
                <h4>Cast</h4>
                <ListGroup className="mb-4">
                  {selectedMovie.actors && selectedMovie.actors.map((actor, i) => (
                    <ListGroupItem key={i}>
                      <b>{actor.actorName}</b> as {actor.characterName}
                    </ListGroupItem>
                  ))}
                </ListGroup>

                <h4>Genre</h4>
                <p>{selectedMovie.genre}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="bg-dark text-white mb-4">
          <Card.Header className="bg-primary text-white">
            <h4>Reviews</h4>
          </Card.Header>
          <Card.Body>
            {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
              <div className="reviews-container">
                {selectedMovie.reviews.map((review, i) => (
                  <Card key={i} className="mb-3 bg-secondary">
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <h5>{review.username || 'Anonymous'}</h5>
                        <span className="text-warning">
                          <BsStarFill /> {review.rating}
                        </span>
                      </div>
                      <Card.Text>{review.review || 'No comment'}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}
          </Card.Body>
        </Card>

        {loggedIn ? (
          <ReviewForm movieId={movieId} />
        ) : (
          <Card className="bg-dark text-white">
            <Card.Body className="text-center">
              <p>Please log in to submit a review.</p>
            </Card.Body>
          </Card>
        )}
      </div>
    );
  };

  return <DetailInfo />;
};

export default MovieDetail;