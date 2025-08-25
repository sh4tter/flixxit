/* eslint-disable no-unused-vars */
import {
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { useRef, useState, useEffect } from "react";
import ListItem from "../listItem/ListItem";
import "./list.scss";

export default function List({ list, isTop10 = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const listRef = useRef();
  const containerRef = useRef();

  const handleScrollRight = () => {
    if (!listRef.current || list.content.length === 0) return;
    
    const itemWidth = 288; // 280px item + 8px gap
    const newIndex = currentIndex + 1;
    
    setCurrentIndex(newIndex);
    listRef.current.style.transform = `translateX(-${newIndex * itemWidth}px)`;
    
    // When we reach the end of the original list, seamlessly reset to beginning
    if (newIndex >= list.content.length) {
      // Wait for the animation to complete, then reset seamlessly
      setTimeout(() => {
        setCurrentIndex(0);
        listRef.current.style.transition = 'none';
        listRef.current.style.transform = 'translateX(0px)';
        
        // Force a reflow
        listRef.current.offsetHeight;
        
        // Restore smooth scrolling
        listRef.current.style.transition = 'transform 0.3s ease';
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
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    
    if (isLeftSwipe) {
      handleScrollRight();
    }
  };

  // Create duplicated content for seamless circular loop
  // We duplicate the content multiple times to ensure smooth infinite scrolling
  const duplicatedContent = [...list.content, ...list.content, ...list.content, ...list.content];

  // Check if this is a horror movies list
  const isHorrorList = list.title.toLowerCase().includes('horror');

  return (
    <div className={`list ${isTop10 ? 'top10-list' : ''} ${isHorrorList ? 'horror-list' : ''}`}>
      <span className="listTitle">
        {list.title}
      </span>
      <div className="wrapper" 
           ref={containerRef}
           onTouchStart={handleTouchStart}
           onTouchMove={handleTouchMove}
           onTouchEnd={handleTouchEnd}>
        <div className="container" ref={listRef}>
          {duplicatedContent.map((item, index) => (
            <ListItem 
              key={`${item}-${index}`} 
              index={index} 
              item={item} 
              isHorrorList={isHorrorList}
            />
          ))}
        </div>
        <ArrowForwardIosOutlined
          className="sliderArrow right"
          onClick={handleScrollRight}
        />
      </div>
    </div>
  );
}
