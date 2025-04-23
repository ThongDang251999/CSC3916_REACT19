import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie } from '../actions/movieActions';
import { Card, Image, Row, Col, Alert } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import ReviewForm from './reviewform';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const navigate = useNavigate();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading);
  const error = useSelector(state => state.movie.error);
  const loggedIn = useSelector(state => state.auth.loggedIn);
  const [refreshKey, setRefreshKey] = useState(0);

  // Ensure we have movie data and refresh when needed
  useEffect(() => {
    console.log("MovieDetail component - movieId:", movieId);
    if (!selectedMovie || selectedMovie._id !== movieId || refreshKey > 0) {
      console.log("Fetching movie details in MovieDetail component");
      dispatch(fetchMovie(movieId));
      if (refreshKey > 0) setRefreshKey(0);
    }
  }, [dispatch, movieId, selectedMovie, refreshKey]);

  const handleReviewAdded = () => {
    // Trigger a refresh of movie data after review is added
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (!loggedIn) {
    // Redirect to login if not logged in
    return (
      <Alert variant="warning" className="text-center p-5">
        Please <Alert.Link onClick={() => navigate('/signin')}>log in</Alert.Link> to view movie details.
      </Alert>
    );
  }

  if (loading) {
    return <div className="text-center p-5">Loading movie details...</div>;
  }

  if (error) {
    return <Alert variant="danger" className="text-center p-5">Error: {error}</Alert>;
  }

  if (!selectedMovie) {
    return <Alert variant="warning" className="text-center p-5">No movie data available. Please try again.</Alert>;
  }

  // Check if reviews exist
  const hasReviews = selectedMovie.reviews && selectedMovie.reviews.length > 0;
  
  return (
    <div className="movie-detail-container">
      <div className="movie-header d-flex flex-column flex-md-row mb-4">
        <div className="movie-poster-section text-center mb-4 mb-md-0">
          <Image 
            src={selectedMovie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
            alt={selectedMovie.title}
            className="movie-poster-img"
          />
        </div>

        <div className="movie-info-card p-4 ms-md-4 flex-grow-1 bg-dark text-white">
          <h2 className="mb-3">{selectedMovie.title} {selectedMovie.releaseDate && `(${selectedMovie.releaseDate})`}</h2>
          
          {selectedMovie.genre && (
            <p><strong>Genre:</strong> {selectedMovie.genre}</p>
          )}
          
          <div className="text-center mb-3">
            <div className="movie-rating">
              <BsStarFill className="text-warning me-1" /> 
              <span className="rating-value">
                {selectedMovie.avgRating 
                  ? Number(selectedMovie.avgRating).toFixed(1) 
                  : 'No ratings'}
              </span>
            </div>
          </div>
          
          <div className="movie-cast mb-4">
            <h4 className="mb-3">Cast</h4>
            {selectedMovie.actors && selectedMovie.actors.length > 0 ? (
              <Row xs={1} md={2} className="g-3">
                {selectedMovie.actors.map((actor, i) => (
                  <Col key={i}>
                    <Card className="bg-dark text-white border-secondary">
                      <Card.Body>
                        <strong>{actor.actorName}</strong> as {actor.characterName}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div>No cast information available</div>
            )}
          </div>
        </div>
      </div>

      <div className="reviews-section bg-dark text-white p-4 mb-4">
        <h3 className="text-center mb-3">Reviews</h3>
        
        {hasReviews ? (
          <div className="reviews-list">
            {selectedMovie.reviews.map((review, i) => (
              <div key={i} className="review-item p-3 mb-3">
                <div className="d-flex justify-content-between">
                  <div className="reviewer-name">{review.username || 'Anonymous'}</div>
                  <div className="review-rating d-flex align-items-center">
                    <BsStarFill className="text-warning me-1" /> {review.rating}
                  </div>
                </div>
                <div className="review-text mt-2">{review.review || 'No comment'}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No reviews yet. Be the first to review!</p>
        )}
        
        {loggedIn ? (
          <ReviewForm movieId={movieId} onReviewAdded={handleReviewAdded} />
        ) : (
          <Alert variant="info" className="mt-3">
            Please log in to submit a review.
          </Alert>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;