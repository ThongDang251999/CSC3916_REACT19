import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie } from '../actions/movieActions';
import { Card, Image, Row, Col, Alert, Container } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import ReviewForm from './reviewform';
import { Link } from 'react-router-dom';

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
    console.log("Review added, refreshing movie data...");
    setRefreshKey(prevKey => prevKey + 1);
    
    // Force re-fetch of movie data
    console.log("Dispatching fetchMovie to update data");
    dispatch(fetchMovie(movieId));
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
    return (
      <div>
        <Alert variant="danger" className="text-center p-5">Error: {error}</Alert>
      </div>
    );
  }

  if (!selectedMovie && !loading) {
    // Redirect to movie list if movie not found
    return (
      <div className="text-center p-5">
        <Alert variant="warning">
          Movie not found. <Link to="/">Return to movie list</Link>
        </Alert>
      </div>
    );
  }

  // Check if reviews exist
  const hasReviews = selectedMovie && selectedMovie.reviews && selectedMovie.reviews.length > 0;
    
  return (
    <Container className="py-4 movie-detail-container">
      <div className="text-center mb-4" style={{ background: 'white', color: 'black', padding: '20px', borderRadius: '0px', maxWidth: '420px', margin: '0 auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div className="poster-frame mb-3" style={{ marginBottom: '10px' }}>
          <Image 
            src={selectedMovie.imageUrl} 
            alt={selectedMovie.title}
            className="movie-poster-img"
            style={{ 
              maxHeight: '500px',
              border: '2px solid #fff', 
              borderRadius: '0px',
              padding: '0px', 
              background: 'white',
              boxShadow: '0 0 5px rgba(0,0,0,0.2)'
            }}
            onError={(e) => {
              console.error(`Failed to load image: ${selectedMovie.imageUrl}`);
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
        </div>

        <h4 className="text-center" style={{ marginTop: '10px', marginBottom: '10px', fontWeight: 'normal', fontSize: '16px' }}>{selectedMovie.title}</h4>
        
        {selectedMovie.actors && selectedMovie.actors.length > 0 && (
          <div className="cast-info text-center" style={{ marginBottom: '15px', lineHeight: '1.2' }}>
            {selectedMovie.actors.map((actor, i) => (
              <div key={i} style={{ marginBottom: '4px', color: '#333', fontSize: '14px' }}>
                <strong>{actor.actorName}</strong> {actor.characterName}
              </div>
            ))}
          </div>
        )}

        <div className="rating d-flex justify-content-center align-items-center" style={{ marginBottom: '5px' }}>
          <BsStarFill className="text-warning me-1" style={{ fontSize: '14px' }} /> 
          <span style={{ fontSize: '14px' }}>{selectedMovie.avgRating ? Number(selectedMovie.avgRating).toFixed(0) : '0'}</span>
        </div>
      </div>
          
      {hasReviews && (
        <div className="reviews-section bg-dark text-white p-3 mb-0" style={{ maxWidth: '420px', margin: '0 auto' }}>
          <div className="reviews-list">
            {selectedMovie.reviews.map((review, i) => (
              <div key={i} className="review-item py-1 px-2 d-flex justify-content-between" style={{ borderBottom: '1px solid #444' }}>
                <div className="review-username" style={{ width: '120px', textAlign: 'left', fontSize: '14px', color: '#aaa' }}>
                  <span>{review.username || 'Anonymous'}</span>
                </div>
                <div className="review-text flex-grow-1" style={{ textAlign: 'left', paddingLeft: '10px', fontSize: '14px', color: '#ddd' }}>
                  {review.review || 'No comment'}
                </div>
                <div className="review-rating" style={{ minWidth: '20px', textAlign: 'right', fontSize: '14px', color: '#aaa' }}>
                  <span>{review.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
          
      {loggedIn && selectedMovie && (
        <ReviewForm 
          movieId={selectedMovie._id} 
          onReviewAdded={handleReviewAdded}
        />
      )}
    </Container>
  );
};

export default MovieDetail;