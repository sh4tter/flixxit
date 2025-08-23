import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axiosInstance';
import './trending.scss';

const TrendingMovies = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/movies/trending');
        setTrendingMovies(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching trending movies:', err);
        setError('Failed to load trending movies');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/watch?id=${movieId}`);
  };

  if (loading) {
    return (
      <div className="trending-section">
        <h2>Trending Now</h2>
        <div className="trending-loading">
          <div className="loading-spinner"></div>
          <p>Loading trending movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trending-section">
        <h2>Trending Now</h2>
        <div className="trending-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-section">
      <h2>Trending Now</h2>
      <div className="trending-carousel">
        {trendingMovies.map((movie, index) => (
          <div 
            key={movie._id} 
            className="trending-item"
            onClick={() => handleMovieClick(movie._id)}
          >
            <span className="trending-number">{index + 1}</span>
            <div className="movie-card">
              <img 
                src={movie.img || movie.imgSm} 
                alt={movie.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x300/000000/FFFFFF?text=No+Image';
                }}
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="views">{movie.views} views</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingMovies;
