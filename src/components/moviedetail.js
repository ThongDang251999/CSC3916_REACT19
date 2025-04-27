import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie, submitReview, fetchMovieReviews } from '../actions/movieActions';
import { Alert, Container, Form, Button, Image } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
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
    if (!selectedMovie || selectedMovie._id !== movieId || refreshKey > 0) {
      console.log("Fetching movie and reviews due to update need");
      
      // First get the movie details
      dispatch(fetchMovie(movieId))
        .then(() => {
          console.log("Movie fetched, now fetching reviews");
          // Then fetch reviews separately 
          return dispatch(fetchMovieReviews(movieId));
        })
        .then(() => {
          console.log("Reviews fetched successfully");
          if (refreshKey > 0) setRefreshKey(0);
        })
        .catch(err => {
          console.error("Error in fetching data:", err);
          if (refreshKey > 0) setRefreshKey(0);
        });
    }
  }, [dispatch, movieId, selectedMovie, refreshKey]);

  const handleReviewAdded = () => {
    console.log("Review added, refreshing data");
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (!loggedIn) {
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
    return (
      <div className="text-center p-5">
        <Alert variant="warning">
          Movie not found. <Link to="/">Return to movie list</Link>
        </Alert>
      </div>
    );
  }
    
  return (
    <div style={{ 
      background: '#1a1a1a', 
      minHeight: '100vh',
      color: 'white',
      padding: '20px'
    }}>
      <Container className="d-flex flex-column align-items-center">
        {/* Movie Poster */}
        <div style={{ 
          maxWidth: '320px',
          marginBottom: '5px',
          border: '2px solid white',
          padding: '5px',
          background: 'white'
        }}>
          <Image 
            src={selectedMovie.imageUrl || 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg'} 
            alt={selectedMovie.title}
            style={{ 
              width: '100%',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg';
            }}
          />
        </div>
        
        {/* Title */}
        <h2 className="text-center mt-4 mb-2">{selectedMovie.title}</h2>
        
        {/* Cast List */}
        <div className="text-center mb-3">
          {selectedMovie.actors && selectedMovie.actors.map((actor, index) => (
            <div key={index} className="mb-1">
              <span style={{ color: '#999' }}>{actor.name}</span> <span style={{ color: '#777' }}>{actor.character}</span>
            </div>
          ))}
        </div>
        
        {/* Rating */}
        <div className="text-center mb-4">
          <BsStarFill className="text-warning" /> 
          <span className="ms-1">
            {selectedMovie.avgRating 
              ? Number(selectedMovie.avgRating).toFixed(1) 
              : (selectedMovie.reviews && selectedMovie.reviews.length > 0
                  ? (selectedMovie.reviews.reduce((sum, r) => sum + r.rating, 0) / selectedMovie.reviews.length).toFixed(1)
                  : '0')}
          </span>
        </div>
        
        {/* Reviews Box */}
        <div style={{ 
          maxWidth: '500px',
          width: '100%',
          background: '#2d3339',
          borderRadius: '5px',
          padding: '15px',
          marginBottom: '15px'
        }}>
          {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
            // Real reviews from API
            selectedMovie.reviews.map((review, i) => (
              <div key={i} className="d-flex justify-content-between py-2" style={{ 
                borderBottom: i < selectedMovie.reviews.length - 1 ? '1px solid #444' : 'none'
              }}>
                <div style={{ color: '#999', width: '25%' }}>
                  {review.username || review.name || 'Anonymous'}
                </div>
                <div style={{ color: '#eee', width: '60%', textAlign: 'left' }}>
                  {review.review || review.comment || 'Great movie'}
                </div>
                <div style={{ color: '#999', width: '15%', textAlign: 'right' }}>
                  {review.rating}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-3" style={{ color: '#999' }}>
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>
        
        {/* Review Form */}
        <ReviewForm movieId={movieId} onReviewAdded={handleReviewAdded} />
      </Container>
    </div>
  );
};

export default MovieDetail;