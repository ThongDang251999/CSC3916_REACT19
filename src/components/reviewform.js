import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { submitReview } from '../actions/movieActions';

const ReviewForm = ({ movieId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
    
    const reviewData = {
      movieId,
      rating: parseInt(rating),
      comment
    };

    dispatch(submitReview(reviewData))
      .then(() => {
        setSuccess(true);
        setRating(0);
        setComment('');
        setValidated(false);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      })
      .catch(err => {
        setError('Failed to submit review. Please try again.');
      });
  };

  return (
    <div className="review-form my-4">
      <h4>Add Your Review</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Review submitted successfully!</Alert>}
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Rating (1-5 stars)</Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a rating between 1 and 5.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a comment.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Submit Review
        </Button>
      </Form>
    </div>
  );
};

export default ReviewForm; 