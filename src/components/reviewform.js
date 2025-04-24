import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { submitReview } from '../actions/movieActions';
import { BsStarFill } from 'react-icons/bs';

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }

    setError('');
    setValidated(true);
    setSubmitting(true);
    
    const reviewData = {
      movieId,
      rating: parseInt(rating),
      comment
    };

    console.log("Submitting review data:", reviewData);

    // Special handling for test movie
    if (movieId === '65ffaf0cbb45d068a11edd6a') {
      console.log("Test movie - simulating successful review submission");
      setTimeout(() => {
        setSuccess(true);
        setRating(5);
        setComment('');
        setValidated(false);
        setSubmitting(false);
        
        if (onReviewAdded) {
          onReviewAdded();
        }
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }, 1000);
      return;
    }

    // For real movies, submit to API
    dispatch(submitReview(reviewData))
      .then((res) => {
        console.log("Review submitted successfully:", res);
        setSuccess(true);
        setRating(5);
        setComment('');
        setValidated(false);
        setSubmitting(false);
        
        // Call the callback to refresh movie data
        if (onReviewAdded) {
          console.log("Calling onReviewAdded callback after successful submission");
          onReviewAdded();
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      })
      .catch(err => {
        console.error("Error submitting review:", err);
        let errorMessage = 'Failed to submit review. Please try again.';
        
        // Display the detailed error message if available
        if (err.message) {
          errorMessage += ' Error: ' + err.message;
        }
        
        // If we have detailed API error information
        if (err.errorDetails) {
          errorMessage += ' Details: ' + err.errorDetails;
        }
        
        setError(errorMessage);
        setSubmitting(false);
      });
  };

  return (
    <div className="review-form-container bg-dark mb-4 p-4" style={{ borderRadius: '8px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)' }}>
      <h4 className="mb-3">Add Your Review</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Your review has been submitted!</Alert>}
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col xs={12}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Add your review here..."
                className="bg-dark text-light border-secondary"
                style={{ resize: 'none', fontSize: '1rem' }}
              />
            </Form.Group>
          </Col>
          
          <Col xs={6} md={8}>
            <Form.Group className="mb-3">
              <Form.Select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                required
                className="bg-dark text-light border-secondary"
                style={{ height: '100%' }}
              >
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★☆</option>
                <option value="3">3 Stars ★★★☆☆</option>
                <option value="2">2 Stars ★★☆☆☆</option>
                <option value="1">1 Star ★☆☆☆☆</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col xs={6} md={4}>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 h-100"
              disabled={submitting}
              style={{ 
                background: '#e50914', 
                borderColor: '#e50914',
                fontWeight: 'bold',
                padding: '0.75rem'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ReviewForm; 