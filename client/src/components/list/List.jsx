/* eslint-disable no-unused-vars */
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { useRef, useState } from "react";
import ListItem from "../listItem/ListItem";
import "./list.scss";

export default function List({ list, isTop10 = false }) {
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [clickLimit, setClickLimit] = useState(window.innerWidth / 230);

  const listRef = useRef();

  const handleClick = (direction) => {
    setIsMoved(true);
    let distance = listRef.current.getBoundingClientRect().x - 50;

    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
    }

    if (
      direction === "right" &&
      slideNumber < list.content.length - clickLimit
    ) {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
    }

    // Check if reached the end or beginning of the list
    if (direction === "left" && slideNumber === 0) {
      // If at the beginning, loop to the end
      setSlideNumber(list.content.length - clickLimit);
      listRef.current.style.transform = `translateX(${
        -230 * (list.content.length - clickLimit) + distance
      }px)`;
    }

    if (
      direction === "right" &&
      slideNumber === list.content.length - clickLimit
    ) {
      // If at the end, loop to the beginning
      setSlideNumber(0);
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
    }
  };
  return (
    <div className={`list ${isTop10 ? 'top10-list' : ''}`}>
      <span className="listTitle">
        {isTop10 && <span className="top10-icon">🔥</span>}
        {list.title}
      </span>
      <div className="wrapper">
        <ArrowBackIosOutlined
          className={`sliderArrow left ${!isMoved && "hide"}`}
          onClick={() => handleClick("left")}
        />
        <div className="container" ref={listRef}>
          {list.content.map((item, index) => (
            <ListItem key={`${item}-${index}`} index={index} item={item} />
          ))}
        </div>
        <ArrowForwardIosOutlined
          className="sliderArrow right"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
}
