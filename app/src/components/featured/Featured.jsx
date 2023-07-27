import { InfoOutlined, PlayArrow } from "@mui/icons-material";
import { useEffect, useState } from "react";
import "./featured.scss";
import { axiosInstance } from "../../axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

export default function Featured({ type, setGenre }) {
  const [content, setContent] = useState({});
  const [movie, setMovie] = useState({});
  const [showVideo, setShowVideo] = useState(false);
  const location = useLocation();
  const trailer = location.movie;

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        const res = await axiosInstance.get(`/movies/random?type=${type}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });

        setMovie(res.data);
        setContent(res.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomContent();
  }, [type]);
  const navigate = useNavigate();

  const showVideoAfterDelay = () => {
    setTimeout(() => {
      setShowVideo(true);

      // Stop the video after 10 seconds
      const stopVideoTimeout = setTimeout(() => {
        setShowVideo(false);
      }, 10000); // 10000 milliseconds (10 seconds)

      // Clear the stopVideoTimeout when the component unmounts or if the video starts playing
      return () => clearTimeout(stopVideoTimeout);
    }, 3000); // 3000 milliseconds (3 seconds) delay before showing the video
  };

  const watchMovie = () => {
    navigate("/watch", {
      state: { movie },
    });
  };

  console.log(content);
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
      {showVideo ? (
        <video
          src={trailer?.video ?? ""}
          autoPlay
          controls
          className="videofeatured"
        />
      ) : (
        <img src={content.img} alt="" onLoad={showVideoAfterDelay} />
      )}
      <div className="info">
        <img src={content.imgTitle} alt="" />
        <span className="desc">{content.desc}</span>
        <div className="buttons">
          <button className="play" onClick={watchMovie}>
            <PlayArrow />
            <span>Play</span>
          </button>
          <button className="more">
            <InfoOutlined />
            <span>Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}
