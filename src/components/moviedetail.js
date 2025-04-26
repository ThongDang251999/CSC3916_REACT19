import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie, submitReview } from '../actions/movieActions';
import { Image, Alert, Container, Form, Button } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Ensure we have movie data and refresh when needed
  useEffect(() => {
    console.log("MovieDetail component - movieId:", movieId);
    if (!selectedMovie || selectedMovie._id !== movieId || refreshKey > 0) {
      console.log("Fetching movie details in MovieDetail component");
      dispatch(fetchMovie(movieId));
      if (refreshKey > 0) setRefreshKey(0);
    }
  }, [dispatch, movieId, selectedMovie, refreshKey]);

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    
    const reviewData = {
      movieId,
      rating: parseInt(rating),
      comment // This will be submitted as 'review' in the API call
    };

    dispatch(submitReview(reviewData))
      .then(() => {
        setRating(5);
        setComment('');
        setSubmitting(false);
        setRefreshKey(prevKey => prevKey + 1);
        
        // Force re-fetch of movie data to show the new review
        dispatch(fetchMovie(movieId));
      })
      .catch(err => {
        console.error("Error submitting review:", err);
        setSubmitting(false);
      });
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

  // Check if reviews exist
  const hasReviews = selectedMovie && selectedMovie.reviews && selectedMovie.reviews.length > 0;
    
  return (
    <div className="movie-detail-page py-4" style={{ background: '#212529', minHeight: '100vh' }}>
      <Container className="d-flex flex-column align-items-center">
        {/* Movie Poster */}
        <div style={{ 
          maxWidth: '400px', 
          padding: '15px', 
          background: 'transparent', 
          marginBottom: '0'
        }}>
          <Image 
            src={selectedMovie.imageUrl || 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg'} 
            alt={selectedMovie.title}
            style={{ 
              width: '100%',
              border: '2px solid #343a40',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg';
            }}
          />
        </div>
        
        {/* Movie Details */}
        <div style={{ 
          background: 'white', 
          color: 'black', 
          width: '100%', 
          maxWidth: '400px', 
          padding: '15px',
          marginTop: '0'
        }}>
          <h5 className="text-center mb-3">{selectedMovie.title}</h5>
          
          {selectedMovie.actors && selectedMovie.actors.length > 0 && (
            <div className="cast-info">
              {selectedMovie.actors.map((actor, i) => (
                <div key={i} className="mb-1 text-center">
                  <strong>{actor.actorName}</strong> {actor.characterName}
                </div>
              ))}
            </div>
          )}
          
          <div className="d-flex justify-content-center align-items-center mt-2">
            <BsStarFill className="text-warning" /> 
            <span className="ms-2">{selectedMovie.avgRating ? Number(selectedMovie.avgRating).toFixed(0) : '0'}</span>
          </div>
        </div>
        
        {/* Reviews */}
        {hasReviews && (
          <div style={{ 
            background: '#343a40', 
            color: '#f8f9fa', 
            width: '100%', 
            maxWidth: '400px', 
            padding: '10px'
          }}>
            {selectedMovie.reviews.map((review, i) => (
              <div key={i} className="d-flex justify-content-between py-1" style={{
                borderBottom: i < selectedMovie.reviews.length - 1 ? '1px solid #555' : 'none'
              }}>
                <div style={{ color: '#aaa', width: '30%' }}>
                  {review.username || 'Anonymous'}
                </div>
                <div style={{ color: '#ddd', width: '60%', textAlign: 'left' }}>
                  {review.review || 'No comment'}
                </div>
                <div style={{ color: '#aaa', width: '10%', textAlign: 'right' }}>
                  {review.rating}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Review Form */}
        <div style={{ 
          background: '#343a40', 
          width: '100%', 
          maxWidth: '400px', 
          padding: '10px'
        }}>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Control
              as="textarea"
              rows={1}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your review here..."
              required
              className="mb-2"
              style={{ 
                background: '#343a40', 
                color: '#f8f9fa', 
                border: '1px solid #555' 
              }}
            />
            
            <div className="d-flex">
              <Form.Select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="me-2"
                style={{ 
                  background: '#343a40', 
                  color: '#f8f9fa', 
                  border: '1px solid #555',
                  width: '100px'
                }}
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </Form.Select>
              
              <Button 
                variant="danger" 
                type="submit" 
                disabled={submitting}
                className="flex-grow-1"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default MovieDetail;