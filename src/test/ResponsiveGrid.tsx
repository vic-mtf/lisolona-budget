import React, { useRef, useState, useEffect } from "react";
import "../styles/autoAspectGrid.css";

const AutoAspectGrid = ({ columns = 2, aspectRatio = 16 / 9, children }) => {
  const containerRef = useRef(null);
  const [itemSize, setItemSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width: containerWidth, height: containerHeight } =
        entry.contentRect;
      const totalItems = React.Children.count(children);
      const rows = Math.ceil(totalItems / columns);

      // Option 1: use width as constraint
      const itemWidthByWidth = containerWidth / columns;
      const itemHeightByWidth = itemWidthByWidth / aspectRatio;
      const totalHeightByWidth = itemHeightByWidth * rows;

      // Option 2: use height as constraint
      const itemHeightByHeight = containerHeight / rows;
      const itemWidthByHeight = itemHeightByHeight * aspectRatio;
      const totalWidthByHeight = itemWidthByHeight * columns;

      // Choose best fit
      if (totalHeightByWidth <= containerHeight) {
        setItemSize({ width: itemWidthByWidth, height: itemHeightByWidth });
      } else {
        setItemSize({ width: itemWidthByHeight, height: itemHeightByHeight });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [columns, aspectRatio, children]);

  return (
    <div className='auto-grid-container' ref={containerRef}>
      {React.Children.map(children, (child, index) => (
        <div
          className='auto-grid-item'
          key={index}
          style={{
            width: `${itemSize.width}px`,
            height: `${itemSize.height}px`,
          }}>
          <div className='auto-grid-content'>{child}</div>
        </div>
      ))}
    </div>
  );
};

export default AutoAspectGrid;
