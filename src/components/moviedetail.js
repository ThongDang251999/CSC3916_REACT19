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
  
  // Test movie data for when API doesn't return data
  const testMovie = {
    _id: '65ffaf0cbb45d068a11edd6a',
    title: 'Guardians of the Galaxy (Test)',
    releaseDate: '2014',
    genre: 'Action/Sci-Fi',
    avgRating: 4.5,
    imageUrl: 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg',
    actors: [
      { actorName: 'Chris Pratt', characterName: 'Star-Lord' },
      { actorName: 'Zoe Saldana', characterName: 'Gamora' },
      { actorName: 'Vin Diesel', characterName: 'Groot' }
    ],
    reviews: [
      { username: 'starLord55', rating: 5, review: 'Great movie' },
      { username: 'gamora55', rating: 5, review: 'Great movie' },
      { username: 'batman', rating: 5, review: 'great movie' }
    ]
  };

  // Ensure we have movie data and refresh when needed
  useEffect(() => {
    console.log("MovieDetail component - movieId:", movieId);
    if (movieId === '65ffaf0cbb45d068a11edd6a') {
      console.log("Using test movie data instead of fetching from API");
      // No need to fetch from API for test movie
    } else if (!selectedMovie || selectedMovie._id !== movieId || refreshKey > 0) {
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
    if (movieId !== '65ffaf0cbb45d068a11edd6a') {
      console.log("Dispatching fetchMovie to update data");
      dispatch(fetchMovie(movieId));
    } else {
      // For test movie, manually update the review list after a timeout to simulate API fetch
      console.log("Using test movie, simulating data refresh");
      setTimeout(() => {
        console.log("Test movie data refreshed");
        // This will trigger re-render for test movie
        setRefreshKey(prevKey => prevKey + 1); 
      }, 500);
    }
  };

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

  if (!loggedIn) {
    // Redirect to login if not logged in
    return (
      <Alert variant="warning" className="text-center p-5">
        Please <Alert.Link onClick={() => navigate('/signin')}>log in</Alert.Link> to view movie details.
      </Alert>
    );
  }

  if (loading && movieId !== '65ffaf0cbb45d068a11edd6a') {
    return <div className="text-center p-5">Loading movie details...</div>;
  }

  if (error && movieId !== '65ffaf0cbb45d068a11edd6a') {
    return (
      <div>
        <Alert variant="danger" className="text-center p-5">Error: {error}</Alert>
        {testImageSection}
      </div>
    );
  }

  // Use test movie data if we're viewing the test movie or if no movie data is available
  const movieData = (movieId === '65ffaf0cbb45d068a11edd6a' || !selectedMovie) ? testMovie : selectedMovie;

  // Check if reviews exist
  const hasReviews = movieData.reviews && movieData.reviews.length > 0;
  
  return (
    <Container className="py-4 movie-detail-container">
      {movieId !== '65ffaf0cbb45d068a11edd6a' && testImageSection}
      
      <div className="text-center mb-4">
        <div className="poster-frame mb-3">
          <Image 
            src={movieData.imageUrl || 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg'} 
            alt={movieData.title}
            className="movie-poster-img"
            style={{ maxHeight: '500px', border: '2px solid #333', padding: '4px', background: '#000' }}
            onError={(e) => {
              console.error(`Failed to load image: ${movieData.imageUrl}`);
              e.target.onerror = null;
              e.target.src = 'https://ichef.bbci.co.uk/images/ic/640x360/p061d1pl.jpg';
            }}
          />
          <div className="mt-2 small">
            <p>Image URL: {movieData.imageUrl || 'No image URL'}</p>
          </div>
        </div>
        
        <h2 className="mb-3 text-center">{movieData.title}</h2>
        
        {movieData.actors && movieData.actors.length > 0 && (
          <div className="cast-info text-center mb-3">
            {movieData.actors.map((actor, i) => (
              <div key={i} className="mb-2">
                <strong>{actor.actorName}</strong> {actor.characterName && `${actor.characterName}`}
              </div>
            ))}
          </div>
        )}
        
        <div className="rating d-flex justify-content-center align-items-center mb-4">
          <BsStarFill className="text-warning me-2" /> 
          <span style={{ fontSize: '1.2rem' }}>
            {movieData.avgRating 
              ? Number(movieData.avgRating).toFixed(0) 
              : '0'}
          </span>
        </div>
      </div>

      {hasReviews && (
        <div className="reviews-section bg-dark text-white p-3 mb-4">
          <div className="reviews-list">
            {movieData.reviews.map((review, i) => (
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
        <ReviewForm 
          movieId={movieId === '65ffaf0cbb45d068a11edd6a' ? '65ffaf0cbb45d068a11edd6a' : movieData._id} 
          onReviewAdded={handleReviewAdded}
        />
      )}
    </Container>
  );
};

export default MovieDetail;