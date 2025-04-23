import React, { useEffect } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, Image, Row, Col, Alert } from 'react-bootstrap';
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

  // Ensure we have movie data
  useEffect(() => {
    console.log("MovieDetail component - movieId:", movieId);
    if (!selectedMovie || selectedMovie._id !== movieId) {
      console.log("Fetching movie details in MovieDetail component");
      dispatch(fetchMovie(movieId));
    }
  }, [dispatch, movieId, selectedMovie]);

  console.log("MovieDetail rendering, selectedMovie:", selectedMovie);

  const DetailInfo = () => {
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
        <div className="movie-poster-section text-center mb-4">
          <Image 
            src={selectedMovie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'} 
            alt={selectedMovie.title}
            className="movie-poster-img"
          />
        </div>

        <div className="movie-info-card p-4 mb-4 bg-dark text-white">
          <h2 className="text-center mb-4">{selectedMovie.title} {selectedMovie.releaseDate && `(${selectedMovie.releaseDate})`}</h2>
          
          <div className="movie-cast mb-4">
            <h4 className="mb-3">Cast</h4>
            {selectedMovie.actors && selectedMovie.actors.length > 0 ? (
              selectedMovie.actors.map((actor, i) => (
                <div key={i} className="cast-member">
                  <strong>{actor.actorName}</strong> as {actor.characterName}
                </div>
              ))
            ) : (
              <div>No cast information available</div>
            )}
          </div>

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
        </div>

        <div className="reviews-section bg-dark text-white p-4 mb-4">
          <h3 className="text-center mb-3">Reviews</h3>
          
          {hasReviews ? (
            <div className="reviews-list">
              {selectedMovie.reviews.map((review, i) => (
                <div key={i} className="review-item p-3 mb-3">
                  <div className="d-flex justify-content-between">
                    <div className="reviewer-name">{review.username || 'Anonymous'}</div>
                    <div className="review-rating">
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
            <ReviewForm movieId={movieId} />
          ) : (
            <Alert variant="info" className="mt-3">
              Please log in to submit a review.
            </Alert>
          )}
        </div>
      </div>
    );
  };

  return <DetailInfo />;
};

export default MovieDetail;