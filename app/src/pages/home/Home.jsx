import Navbar from "../../components/navbar/Navbar";
import Featured from "../../components/featured/Featured";
import "./home.scss";
import List from "../../components/list/List";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../axiosInstance";
import "../../customscroll.css";

const Home = ({ type }) => {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);
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
      try {
        const res = await axiosInstance.get(
          `lists${type ? "?type=" + type : ""}
        ${genre ? "&genre=" + genre : ""}`,
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        setLists(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomLists();
  }, [type, genre]);

  return (
    <div className="home">
      <Navbar />
      <Featured type={type} setGenre={setGenre} />
      {lists.map((list) => (
        <List key={list.id} list={list} />
      ))}
    </div>
  );
};

export default Home;
