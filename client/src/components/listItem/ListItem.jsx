import "./listItem.scss";
import {
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownOutlined,
} from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { createPortal } from "react-dom";

// Simple cache to prevent repeated requests for the same movie
const movieCache = new Map();

export default function ListItem({ index, item, isHorrorList = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [zoomedCardPosition, setZoomedCardPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const hoverTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);
  const zoomTimeoutRef = useRef(null);
  const itemRef = useRef(null);

  useEffect(() => {
    const getMovie = async () => {
      if (!item) return;
      
      // Check cache first
      if (movieCache.has(item)) {
        const cachedData = movieCache.get(item);
        setMovie(cachedData);
        setIsLoading(false);
        if (cachedData.error) {
          setError("Failed to load movie");
        }
        return;
      }
      
      // Check if we already have the movie data to prevent unnecessary requests
      if (movie._id === item) return;
      
      setIsLoading(true);
      setError(null);
      setImageError(false);
      try {
        const res = await axiosInstance.get("/movies/find/" + item);
        const movieData = res.data;
        setMovie(movieData);
        // Cache the result
        movieCache.set(item, movieData);
      } catch (err) {
        // Only log 404 errors once to reduce spam
        if (err.response?.status !== 404) {
          console.error("Error fetching movie:", err);
        }
        setError("Failed to load movie");
        // Cache the error to prevent repeated requests
        movieCache.set(item, { error: true });
      } finally {
        setIsLoading(false);
      }
    };
    getMovie();
  }, [item]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  const handleZoom = () => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setZoomedCardPosition({
        top: rect.top - 20,
        left: rect.left - 70
      });
    }
    setIsZoomed(true);
  };

  const handleUnzoom = () => {
    setIsZoomed(false);
  };

  const watchMovie = async () => {
    try {
      // Increment movie views when clicked
      await axiosInstance.post('/movies/increment-views', {
        movieId: movie._id,
        incrementBy: 1
      });
    } catch (err) {
      console.error('Error incrementing movie views:', err);
    }
    
    navigate("/watch", {
      state: { movie },
    });
  };

  if (isLoading) {
    return (
      <div className="listItem loading">
        <div className="loading-placeholder"></div>
      </div>
    );
  }

  if (error || movie.error) {
    return (
      <div className="listItem">
        <div className="error-placeholder">
          <span>⚠️</span>
          <p>Movie not found</p>
        </div>
      </div>
    );
  }

  const handleImageError = (e) => {
    setImageError(true);
    // Use a simple data URL for placeholder instead of external service
    const canvas = document.createElement('canvas');
    canvas.width = 225;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(0, 0, 225, 120);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const title = movie?.title || 'Movie';
    const words = title.split(' ');
    let y = 60;
    
    if (words.length <= 2) {
      ctx.fillText(title, 112.5, y);
    } else {
      // Split long titles into multiple lines
      const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
      const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
      ctx.fillText(line1, 112.5, y - 10);
      ctx.fillText(line2, 112.5, y + 10);
    }
    
    e.target.src = canvas.toDataURL();
  };

  // Determine which image to use with fallback logic
  const getImageSource = () => {
    // Priority order: imgSm (thumbnail) -> img (poster) -> placeholder
    if (movie?.imgSm && !imageError) {
      return movie.imgSm;
    }
    if (movie?.img && !imageError) {
      return movie.img;
    }
    return null; // Will trigger placeholder
  };

  const imageSource = getImageSource();

  return (
    <>
      <div className="listItem-wrapper">
        <div
          ref={itemRef}
          className={`listItem ${isZoomed ? 'zoomed' : ''}`}
        onMouseEnter={(e) => {
          // Don't re-trigger if already hovered
          if (isHovered) return;
          
          // Clear any existing leave timeout
          if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current);
            leaveTimeoutRef.current = null;
          }
          
          // Clear any existing zoom timeout
          if (zoomTimeoutRef.current) {
            clearTimeout(zoomTimeoutRef.current);
            zoomTimeoutRef.current = null;
          }
          
          // Set hover with delay
          hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(true);
          }, 300); // 300ms delay
          
          // Show zoomed card with longer delay
          zoomTimeoutRef.current = setTimeout(() => {
            handleZoom();
          }, 800); // 800ms delay for zoomed card
        }}
        onMouseLeave={(e) => {
          // Check if mouse is still within the item or its zoomed card
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          
          // If mouse is within the zoomed card area, don't close
          if (isZoomed) {
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
          
          // Clear any existing hover timeout
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
          }
          
          // Clear any existing zoom timeout
          if (zoomTimeoutRef.current) {
            clearTimeout(zoomTimeoutRef.current);
            zoomTimeoutRef.current = null;
          }
          
          // Close immediately when mouse leaves
          setIsHovered(false);
          handleUnzoom();
        }}
      >
        {imageSource ? (
          <img 
            src={imageSource} 
            alt={movie?.title || 'Movie'} 
            onError={handleImageError}
            style={{ 
              display: isHovered && movie?.trailer ? 'none' : 'block',
              zIndex: 1 
            }}
          />
        ) : (
          <div className="placeholder-image">
            <span className="placeholder-text">{movie?.title || 'Movie'}</span>
          </div>
        )}
        {isHovered && movie?.trailer && (
          <video src={movie?.trailer} autoPlay={true} loop style={{ zIndex: 2 }} />
        )}
        
        </div>
      </div>
      
      {/* Portal-based Zoomed Card */}
      {isZoomed && createPortal(
        <div 
          className="zoomed-card-portal"
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
            if (leaveTimeoutRef.current) {
              clearTimeout(leaveTimeoutRef.current);
              leaveTimeoutRef.current = null;
            }
            if (zoomTimeoutRef.current) {
              clearTimeout(zoomTimeoutRef.current);
              zoomTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            // Close immediately when leaving the zoomed card
            setIsHovered(false);
            handleUnzoom();
          }}
        >
          {/* Video Section (60% of card height) */}
          <div className="video-section" style={{ height: '300px', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
            {movie.trailer ? (
              <video
                src={movie.trailer}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
            ) : (
              <div className="no-trailer" style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img 
                  src={movie.imgSm || movie.img} 
                  alt={movie.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="placeholder-image" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'none', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '18px', fontWeight: 500, textAlign: 'center', padding: '20px' }}>{movie.title}</span>
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
                onClick={watchMovie}
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
                <span className="duration" style={{ color: '#46d369', fontWeight: 500 }}>{movie.duration}</span>
                <span className="rating" style={{ border: '1px solid #b3b3b3', padding: '2px 6px', borderRadius: '2px', fontSize: '12px' }}>+{movie.limit}</span>
                <span className="year">{movie.year}</span>
                <span className="genre">{movie.genre}</span>
              </div>
              
              <div className="description" style={{ fontSize: '14px', lineHeight: 1.5, color: '#e5e5e5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {movie.desc}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
