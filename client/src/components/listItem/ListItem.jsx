import "./listItem.scss";
import {
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
// Remove the import since via.placeholder.com is not working

// Simple cache to prevent repeated requests for the same movie
const movieCache = new Map();

export default function ListItem({ index, item }) {
  const [isHovered, setIsHovered] = useState(false);
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const watchMovie = () => {
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

  return (
    <div>
      <div
        className={`listItem ${isHovered ? 'expanded' : ''}`}
        style={{ left: isHovered && index * 225 - 50 + index * 2.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={movie?.imgSm} 
          alt={movie?.title || 'Movie'} 
          onError={handleImageError}
        />
        {isHovered && movie?.trailer && (
          <>
            <video src={movie?.trailer} autoPlay={true} loop />
            <div className="itemInfo">
              <div className="icons">
                <PlayArrow className="icon" onClick={watchMovie} />
                <Add className="icon" />
                <ThumbUpAltOutlined className="icon" />
                <ThumbDownOutlined className="icon" />
              </div>
              <div className="itemInfoTop">
                <span>{movie.duration}</span>
                <span className="limit">+{movie.limit}</span>
                <span>{movie.year}</span>
              </div>
              <div className="desc">{movie.desc}</div>
              <div className="genre">{movie.genre}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
