import { PlayArrow } from "@mui/icons-material";
// import { InfoOutlined} from "@mui/icons-material";
import { useEffect, useState } from "react";
import "./featured.scss";
import { axiosInstance } from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
// Remove the import since we're using canvas-based placeholders

export default function Featured({ type, setGenre, item }) {
  const [content, setContent] = useState({});
  const [movie, setMovie] = useState({});
  const [randomItem, setRandomItem] = useState({}); // New state to store random item
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getMovie = async () => {
      if (!item) return;
      try {
        const res = await axiosInstance.get("/movies/find/" + item);
        setMovie(res.data);
      } catch (err) {
        console.error("Error fetching movie:", err);
        setError("Failed to load movie details");
      }
    };
    getMovie();
  }, [item]);

  useEffect(() => {
    const getRandomContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/movies/random?type=${type}`);
        setContent(res.data[0]);
        setRandomItem(res.data[0]); // Store random item in randomItem state
      } catch (err) {
        console.error("Error fetching random content:", err);
        setError("Failed to load featured content");
      } finally {
        setIsLoading(false);
      }
    };
    getRandomContent();
  }, [type]);

  const handleImageError = (e) => {
    // Create a simple placeholder using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(0, 0, 1920, 1080);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const title = content?.title || 'Featured';
    ctx.fillText(title, 960, 540);
    
    e.target.src = canvas.toDataURL();
  };

  const handleTitleImageError = (e) => {
    // Create a simple placeholder for title image
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(0, 0, 400, 200);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const title = content?.title || 'Title';
    ctx.fillText(title, 200, 100);
    
    e.target.src = canvas.toDataURL();
  };

  const watchMovie = () => {
    navigate("/watch", {
      state: { movie: randomItem }, // Use randomItem as the movie for navigation
    });
  };

  if (isLoading) {
    return (
      <div className="featured">
        <div className="loading">Loading featured content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="featured">
      {type && (
        <div className="category">
          <span>{type === "movies" ? "Movies" : "Series"}</span>
          <select
            name="genre"
            id="genre"
            onChange={(e) => setGenre(e.target.value)}
          >
            <option>Genre</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}
      <img src={content.img} alt={content.title || 'Featured'} onError={handleImageError} />
      <div className="info">
        <img src={content.imgTitle} alt={content.title || 'Title'} onError={handleTitleImageError} />
        <span className="desc">{content.desc}</span>
        <div className="buttons">
          <button className="play" onClick={watchMovie}>
            <PlayArrow />
            <span>Play</span>
          </button>
          {/* <button className="more">
            <InfoOutlined />
            <span>Info</span>
          </button> */}
        </div>
      </div>
    </div>
  );
}
