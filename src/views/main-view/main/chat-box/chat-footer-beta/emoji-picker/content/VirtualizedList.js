import React, { useState, useRef, useEffect, useCallback } from 'react';

const VirtualizedList = ({ items, itemHeight, visibleCount }) => {
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef(null);
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const scrollTop = container.scrollTop;
      const newStartIndex = Math.floor(scrollTop / itemHeight);
      setStartIndex(newStartIndex);
    }
  }, [itemHeight]);

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const visibleItems = items.slice(startIndex, startIndex + visibleCount);
  const totalHeight = items.length * itemHeight;
  const paddingTop = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      style={{
        height: visibleCount * itemHeight,
        overflowY: 'scroll',
        position: 'relative',
      }}
    >
      <div style={{ height: totalHeight, paddingTop }}>
        {visibleItems.map((item, index) => (
          <div
            key={index}
            style={{
              height: itemHeight,
              display: 'inline-block',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedList;