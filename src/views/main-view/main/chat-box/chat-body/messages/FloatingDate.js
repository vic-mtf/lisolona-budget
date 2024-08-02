import React, { useState, useEffect } from 'react';

const FloatingDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentDate]);

  const handleScroll = () => {
    setCurrentDate(new Date());
    setIsVisible(true);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ display: isVisible ? 'block' : 'none' }}>
      {/* Affichez la date actuelle ici */}
      {currentDate.toDateString()}
    </div>
  );
};

export default FloatingDate;
