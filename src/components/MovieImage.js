import React from 'react';

const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/300x450?text=No+Image';

const MovieImage = ({ src, alt, className }) => {
  const handleError = (e) => {
    e.target.onerror = null; // Prevents infinite loop
    e.target.src = DEFAULT_PLACEHOLDER;
  };

  return (
    <img
      src={src || DEFAULT_PLACEHOLDER}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default MovieImage; 