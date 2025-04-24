import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie } from '../actions/movieActions';
import { Card, Image, Row, Col, Alert, Container } from 'react-bootstrap';
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

  // Test image section to check if images work
  const testImageSection = (
    <div className="mb-4 p-3 bg-dark">
      <h4 className="text-center mb-3">Test Image</h4>
      <div className="text-center">
        <img 
          src="https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg" 
          alt="Test Guardians of the Galaxy" 
          className="img-fluid"
          style={{ maxHeight: "300px" }}
        />
        <p className="mt-2">Direct hardcoded test image URL</p>
      </div>
    </div>
  );

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
    <Container className="py-4 movie-detail-container">
      {testImageSection}
      
      <div className="text-center mb-4">
        <div className="poster-frame mb-3">
          <Image 
            src={selectedMovie.imageUrl || 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg'} 
            alt={selectedMovie.title}
            className="movie-poster-img"
            style={{ maxHeight: '500px', border: '2px solid #333', padding: '4px', background: '#000' }}
          />
          <div className="mt-2 small">
            <p>Image URL: {selectedMovie.imageUrl || 'No image URL'}</p>
          </div>
        </div>
        
        <h2 className="mb-3 text-center">{selectedMovie.title}</h2>
        
        {selectedMovie.actors && selectedMovie.actors.length > 0 && (
          <div className="cast-info text-center mb-3">
            {selectedMovie.actors.map((actor, i) => (
              <div key={i} className="mb-2">
                <strong>{actor.actorName}</strong> {actor.characterName && `${actor.characterName}`}
              </div>
            ))}
          </div>
        )}
        
        <div className="rating d-flex justify-content-center align-items-center mb-4">
          <BsStarFill className="text-warning me-2" /> 
          <span style={{ fontSize: '1.2rem' }}>
            {selectedMovie.avgRating 
              ? Number(selectedMovie.avgRating).toFixed(0) 
              : '0'}
          </span>
        </div>
      </div>

      {hasReviews && (
        <div className="reviews-section bg-dark text-white p-3 mb-4">
          <div className="reviews-list">
            {selectedMovie.reviews.map((review, i) => (
              <div key={i} className="review-item p-2 mb-2 d-flex">
                <div className="review-username me-2">
                  <strong>{review.username || 'Anonymous'}</strong>
                </div>
                <div className="review-text">
                  {review.review || 'No comment'}
                </div>
                <div className="ms-auto review-rating d-flex align-items-center">
                  <span>{review.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {loggedIn && (
        <ReviewForm movieId={movieId} onReviewAdded={handleReviewAdded} />
      )}
    </Container>
  );
};

export default MovieDetail;