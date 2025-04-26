import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie, submitReview } from '../actions/movieActions';
import { Alert, Container, Form, Button, Image } from 'react-bootstrap';
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
    if (!selectedMovie || selectedMovie._id !== movieId || refreshKey > 0) {
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
        <h2 className="text-center mt-4 mb-2">Guardians of the Galaxy (Test)</h2>
        
        {/* Cast List */}
        <div className="text-center mb-3">
          <div className="mb-1">
            <span style={{ color: '#999' }}>Chris Pratt</span> <span style={{ color: '#777' }}>Star-Lord</span>
          </div>
          <div className="mb-1">
            <span style={{ color: '#999' }}>Zoe Saldana</span> <span style={{ color: '#777' }}>Gamora</span>
          </div>
          <div className="mb-1">
            <span style={{ color: '#999' }}>Vin Diesel</span> <span style={{ color: '#777' }}>Groot</span>
          </div>
        </div>
        
        {/* Rating */}
        <div className="text-center mb-4">
          <BsStarFill className="text-warning" /> 
          <span className="ms-1">5</span>
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
          <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid #444' }}>
            <div style={{ color: '#999', width: '25%' }}>starLord55</div>
            <div style={{ color: '#eee', width: '60%', textAlign: 'left' }}>Great movie</div>
            <div style={{ color: '#999', width: '15%', textAlign: 'right' }}>5</div>
          </div>
          <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid #444' }}>
            <div style={{ color: '#999', width: '25%' }}>gamora55</div>
            <div style={{ color: '#eee', width: '60%', textAlign: 'left' }}>Great movie</div>
            <div style={{ color: '#999', width: '15%', textAlign: 'right' }}>5</div>
          </div>
          <div className="d-flex justify-content-between py-2">
            <div style={{ color: '#999', width: '25%' }}>batman</div>
            <div style={{ color: '#eee', width: '60%', textAlign: 'left' }}>great movie</div>
            <div style={{ color: '#999', width: '15%', textAlign: 'right' }}>5</div>
          </div>
        </div>
        
        {/* Review Form */}
        <div style={{ 
          maxWidth: '500px',
          width: '100%',
          background: '#2d3339',
          borderRadius: '5px',
          padding: '15px'
        }}>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Control
              as="textarea"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your review here..."
              required
              className="mb-3"
              style={{ 
                background: '#3a4147', 
                color: '#eee', 
                border: 'none',
                borderRadius: '5px'
              }}
            />
            
            <div className="d-flex">
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="me-2"
                style={{ 
                  background: '#3a4147', 
                  color: '#eee', 
                  border: 'none',
                  borderRadius: '5px',
                  padding: '8px 10px',
                  width: '120px'
                }}
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              
              <Button 
                type="submit" 
                disabled={submitting}
                className="flex-grow-1"
                style={{
                  backgroundColor: '#dc3545',
                  borderColor: '#dc3545',
                  color: 'white'
                }}
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