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

    dispatch(submitReview(reviewData))
      .then(() => {
        console.log("Review submitted successfully");
        setSuccess(true);
        setRating(5);
        setComment('');
        setValidated(false);
        setSubmitting(false);
        
        // Call the callback to refresh movie data
        if (onReviewAdded) {
          onReviewAdded();
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      })
      .catch(err => {
        console.error("Error submitting review:", err);
        setError('Failed to submit review. Please try again.');
        setSubmitting(false);
      });
  };

  return (
    <div className="review-form-container bg-dark mb-4">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Your review has been submitted!</Alert>}
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="g-2">
          <Col xs={12}>
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Add your review here..."
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>
          </Col>
          
          <Col xs={6}>
            <Form.Group className="mb-2">
              <Form.Select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                required
                className="bg-dark text-light border-secondary"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col xs={6}>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100"
              disabled={submitting}
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