import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { submitReview } from '../actions/movieActions';
import { BsStarFill } from 'react-icons/bs';

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
    <div className="review-form-container mt-4 p-4 bg-dark border-top border-secondary">
      <h4 className="mb-4 text-center">Add Your Review</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Your review has been submitted!</Alert>}
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3 text-center">
              <Form.Label>Your Rating</Form.Label>
              <div className="d-flex justify-content-center align-items-center">
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                  className="me-2 rating-input"
                  style={{ width: '70px', textAlign: 'center' }}
                />
                <BsStarFill className="text-warning" size={20} />
              </div>
              <Form.Control.Feedback type="invalid">
                Please provide a rating between 1 and 5.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="What did you think about this movie?"
              />
              <Form.Control.Feedback type="invalid">
                Please provide your thoughts on the movie.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        
        <div className="d-flex justify-content-center mt-3">
          <Button variant="primary" type="submit" className="px-4">
            Submit Review
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ReviewForm; 