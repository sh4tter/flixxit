import { PlayArrow } from "@mui/icons-material";
// import { InfoOutlined} from "@mui/icons-material";
import { useEffect, useState } from "react";
import "./featured.scss";
import { axiosInstance } from "../../axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Featured({ type, setGenre, item }) {
  const [content, setContent] = useState({});
  const [movie, setMovie] = useState({});
  const [randomItem, setRandomItem] = useState({}); // New state to store random item
  const navigate = useNavigate();

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axiosInstance.get("/movies/find/" + item, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setMovie(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMovie();
  }, [item]);

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        const res = await axiosInstance.get(`/movies/random?type=${type}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setContent(res.data[0]);
        setRandomItem(res.data[0]); // Store random item in randomItem state
      } catch (err) {
        console.log(err);
      }
    };
    getRandomContent();
  }, [type]);

  const watchMovie = () => {
    navigate("/watch", {
      state: { movie: randomItem }, // Use randomItem as the movie for navigation
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
      <img src={content.img} alt="" />
      <div className="info">
        <img src={content.imgTitle} alt="" />
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
