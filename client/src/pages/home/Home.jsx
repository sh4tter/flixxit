import Navbar from "../../components/navbar/Navbar";
import Featured from "../../components/featured/Featured";
import "./home.scss";
import List from "../../components/list/List";
import TrendingMovies from "../../components/trending/TrendingMovies";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../axiosInstance";
import "../../customscroll.css";

const Home = ({ type }) => {
  const [lists, setLists] = useState([]);
  const [top10List, setTop10List] = useState(null);
  const [genre, setGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const applyCustomScrollbarStyles = () => {
      const root = document.documentElement;
      root.style.setProperty("--scrollbar-width", "8px"); // Adjust the width as needed
      root.style.setProperty("--scrollbar-thumb-color", "rgba(0, 0, 0, 0.3)"); // Adjust the color as needed
      root.style.setProperty("--scrollbar-thumb-border-radius", "4px"); // Adjust the border radius as needed
    };

    applyCustomScrollbarStyles();
  }, []);

  useEffect(() => {
    const getRandomLists = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get regular lists
        const res = await axiosInstance.get(
          `lists${type ? "?type=" + type : ""}
        ${genre ? "&genre=" + genre : ""}`
        );
        setLists(res.data);

        // Get Top 10 list if it exists
        try {
          const top10Res = await axiosInstance.get("lists?type=top10");
          if (top10Res.data && top10Res.data.length > 0) {
            setTop10List(top10Res.data[0]);
          }
        } catch (top10Err) {
          // Don't log this as an error since it's expected when no Top 10 list exists
          console.log("No Top 10 list found - this is normal if you haven't created one yet");
        }
      } catch (err) {
        console.error("Error fetching lists:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    getRandomLists();
  }, [type, genre]);

  if (isLoading) {
    return (
      <div className="home">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <Navbar />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home">
      <Navbar />
      <Featured type={type} setGenre={setGenre} />
      <TrendingMovies />
      {top10List && (
        <List key={top10List._id} list={top10List} isTop10={true} />
      )}
      {lists.map((list) => (
        <List key={list._id} list={list} />
      ))}
    </div>
  );
};

export default Home;
