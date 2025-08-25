import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowForwardIosOutlined, PlayArrow, Add, ThumbUpAltOutlined, ThumbDownOutlined } from '@mui/icons-material';
import { axiosInstance } from '../../axiosInstance';
import { createPortal } from 'react-dom';
import './trending.scss';

const TrendingMovies = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomedItemId, setZoomedItemId] = useState(null);
  const [zoomedCardPosition, setZoomedCardPosition] = useState({ top: 0, left: 0 });
  const [zoomedMovie, setZoomedMovie] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const navigate = useNavigate();
  const carouselRef = useRef();

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

  const handleMovieClick = async (movieId) => {
    try {
      // Increment movie views when clicked
      await axiosInstance.post('/movies/increment-views', {
        movieId: movieId,
        incrementBy: 1
      });
    } catch (err) {
      console.error('Error incrementing movie views:', err);
    }
    
    navigate(`/watch?id=${movieId}`);
  };

  const handleHover = (movieId) => {
    setHoveredItemId(movieId);
  };

  const handleUnhover = () => {
    setHoveredItemId(null);
  };

  const handleZoom = (movie, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoomedCardPosition({
      top: rect.top - 20,
      left: rect.left - 110
    });
    setZoomedMovie(movie);
    setZoomedItemId(movie._id);
  };

  const handleUnzoom = () => {
    setZoomedItemId(null);
    setZoomedMovie(null);
  };

  const handleScrollRight = () => {
    if (!carouselRef.current || trendingMovies.length === 0) return;
    
    const itemWidth = 280; // 200px item + 80px gap
    const newIndex = currentIndex + 1;
    
    setCurrentIndex(newIndex);
    carouselRef.current.style.transform = `translateX(-${newIndex * itemWidth}px)`;
    
    // When we reach the end of the original list, seamlessly reset to beginning
    if (newIndex >= trendingMovies.length) {
      // Wait for the animation to complete, then reset seamlessly
      setTimeout(() => {
        setCurrentIndex(0);
        carouselRef.current.style.transition = 'none';
        carouselRef.current.style.transform = 'translateX(0px)';
        
        // Force a reflow
        carouselRef.current.offsetHeight;
        
        // Restore smooth scrolling
        carouselRef.current.style.transition = 'transform 0.3s ease';
      }, 300); // Match the CSS transition duration
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !carouselRef.current) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    
    if (isLeftSwipe) {
      handleScrollRight();
    }
  };

  // Create duplicated content for seamless circular loop
  // We duplicate the content multiple times to ensure smooth infinite scrolling
  const displayMovies = [...trendingMovies, ...trendingMovies, ...trendingMovies, ...trendingMovies];

  // Show loading state
  if (loading) {
    return (
      <div className="trending-section">
        <h2>Trending Now</h2>
        <div className="trending-loading">
          <p>Loading trending movies...</p>
        </div>
      </div>
    );
  }

  // Show error state
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

  // Show message when no trending movies are available
  if (!loading && trendingMovies.length === 0) {
    return (
      <div className="trending-section">
        <h2>Trending Now</h2>
        <div className="trending-error">
          <p>No trending movies available yet. Start watching movies to see what's trending!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-section">
      <h2>Trending Now</h2>
      <div className="trending-wrapper">
        <div 
          className="trending-carousel"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {displayMovies.map((movie, index) => {
            const number = (index % trendingMovies.length) + 1;
            const isMultiDigit = number >= 10;
            
            const isZoomed = zoomedItemId === movie._id;
            const isHovered = hoveredItemId === movie._id;
            
            return (
              <div 
                key={`${movie._id}-${index}`} 
                className={`trending-item ${isMultiDigit ? 'multi-digit' : ''} ${isZoomed ? 'zoomed' : ''}`}
                onMouseEnter={(e) => {
                  // Set hover immediately
                  handleHover(movie._id);
                  
                  // Show zoomed card with delay
                  setTimeout(() => handleZoom(movie, e), 800);
                }}
                onMouseLeave={(e) => {
                  // Check if mouse is still within the zoomed card area
                  if (zoomedItemId === movie._id) {
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;
                    
                    const zoomedRect = {
                      left: zoomedCardPosition.left,
                      right: zoomedCardPosition.left + 420,
                      top: zoomedCardPosition.top,
                      bottom: zoomedCardPosition.top + 500
                    };
                    
                    if (mouseX >= zoomedRect.left && mouseX <= zoomedRect.right &&
                        mouseY >= zoomedRect.top && mouseY <= zoomedRect.bottom) {
                      return; // Mouse is over zoomed card, keep it open
                    }
                  }
                  
                  // Close immediately when mouse leaves
                  handleUnhover();
                  handleUnzoom();
                }}
              >
                <span className="trending-number">{(index % trendingMovies.length) + 1}</span>
                <div className="movie-card">
                  <div className="movie-poster">
                    {movie.imgSm || movie.img ? (
                      <img 
                        src={movie.imgSm || movie.img} 
                        alt={movie.title}
                        style={{ 
                          display: isHovered && movie.trailer ? 'none' : 'block',
                          zIndex: 1 
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="placeholder-poster">
                      <span className="placeholder-text">{movie.title}</span>
                    </div>
                  </div>
                  
                  {/* Video overlay on hover - same as normal list items */}
                  {isHovered && movie.trailer && (
                    <video 
                      src={movie.trailer} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 2
                      }}
                    />
                  )}
                  
                  {/* Hover overlay - same as normal list items */}
                  {isHovered && (
                    <div className="itemInfo" style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.9))',
                      padding: '10px',
                      zIndex: 3,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div className="icons" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <button 
                          onClick={() => handleMovieClick(movie._id)}
                          style={{
                            border: '2px solid rgba(255, 255, 255, 0.7)',
                            background: 'rgba(0, 0, 0, 0.6)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.15s ease-out'
                          }}
                        >
                          <PlayArrow style={{ fontSize: '16px' }} />
                        </button>
                        <button style={{
                          border: '2px solid rgba(255, 255, 255, 0.7)',
                          background: 'rgba(0, 0, 0, 0.6)',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'white',
                          transition: 'all 0.15s ease-out'
                        }}>
                          <Add style={{ fontSize: '16px' }} />
                        </button>
                        <button style={{
                          border: '2px solid rgba(255, 255, 255, 0.7)',
                          background: 'rgba(0, 0, 0, 0.6)',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'white',
                          transition: 'all 0.15s ease-out'
                        }}>
                          <ThumbUpAltOutlined style={{ fontSize: '16px' }} />
                        </button>
                        <button style={{
                          border: '2px solid rgba(255, 255, 255, 0.7)',
                          background: 'rgba(0, 0, 0, 0.6)',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'white',
                          transition: 'all 0.15s ease-out'
                        }}>
                          <ThumbDownOutlined style={{ fontSize: '16px' }} />
                        </button>
                      </div>
                      <div className="itemInfoTop" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', color: '#b3b3b3' }}>
                        <span>{movie.duration}</span>
                        <span className="limit" style={{ border: '1px solid #b3b3b3', padding: '1px 4px', borderRadius: '2px', fontSize: '10px' }}>+{movie.limit}</span>
                        <span>{movie.year}</span>
                      </div>
                      <div className="desc" style={{ fontSize: '12px', color: '#e5e5e5', lineHeight: 1.3, marginBottom: '4px' }}>
                        {movie.desc}
                      </div>
                      <div className="genre" style={{ fontSize: '12px', color: '#b3b3b3' }}>
                        {movie.genre}
                      </div>
                    </div>
                  )}
                </div>
                

              </div>
            );
          })}
        </div>
        <ArrowForwardIosOutlined
          className="trending-arrow right"
          onClick={handleScrollRight}
        />
      </div>
      
      {/* Portal-based Zoomed Card for Trending */}
      {zoomedMovie && createPortal(
        <div 
          className="zoomed-card-portal-trending"
          style={{
            position: 'fixed',
            top: zoomedCardPosition.top,
            left: zoomedCardPosition.left,
            width: '420px',
            height: '500px',
            zIndex: 999999,
            transform: 'scale(1.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            borderRadius: '8px',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.98))',
            isolation: 'isolate'
          }}
          onMouseEnter={() => {
            // Keep zoomed when hovering over the content
          }}
          onMouseLeave={() => {
            // Close immediately when leaving the zoomed card
            handleUnzoom();
          }}
        >
          {/* Video Section (60% of card height) */}
          <div className="video-section" style={{ height: '300px', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
            {zoomedMovie.trailer ? (
              <video
                src={zoomedMovie.trailer}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
            ) : (
              <div className="no-trailer" style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img 
                  src={zoomedMovie.imgSm || zoomedMovie.img} 
                  alt={zoomedMovie.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="placeholder-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'none', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '18px', fontWeight: 500, textAlign: 'center', padding: '20px' }}>{zoomedMovie.title}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Section (40% of card height) */}
          <div className="interactive-section" style={{ height: '200px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {/* Action buttons */}
            <div className="action-buttons" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button 
                className="action-btn play-btn"
                onClick={() => handleMovieClick(zoomedMovie._id)}
                title="Watch Movie"
                style={{ border: 'none', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', color: 'white' }}
              >
                <PlayArrow style={{ fontSize: '20px' }} />
              </button>
              
              <button 
                className="action-btn favorites-btn"
                title="Add to Favorites"
                style={{ border: 'none', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', color: 'white' }}
              >
                <Add style={{ fontSize: '20px' }} />
              </button>
              
              <button 
                className="action-btn like-btn"
                title="Like"
                style={{ border: 'none', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', color: 'white' }}
              >
                <ThumbUpAltOutlined style={{ fontSize: '20px' }} />
              </button>
              
              <button 
                className="action-btn dislike-btn"
                title="Dislike"
                style={{ border: 'none', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', color: 'white' }}
              >
                <ThumbDownOutlined style={{ fontSize: '20px' }} />
              </button>
            </div>

            {/* Movie info */}
            <div className="movie-info" style={{ flex: 1 }}>
              <div className="movie-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '14px', color: '#b3b3b3' }}>
                <span className="duration" style={{ color: '#46d369', fontWeight: 500 }}>{zoomedMovie.duration}</span>
                <span className="rating" style={{ border: '1px solid #b3b3b3', padding: '2px 6px', borderRadius: '2px', fontSize: '12px' }}>+{zoomedMovie.limit}</span>
                <span className="year">{zoomedMovie.year}</span>
                <span className="genre">{zoomedMovie.genre}</span>
              </div>
              
              <div className="description" style={{ fontSize: '14px', lineHeight: 1.5, color: '#e5e5e5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {zoomedMovie.desc}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TrendingMovies;
