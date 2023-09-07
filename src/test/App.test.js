import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fade } from "@mui/material";

// Les couleurs à afficher dans le Carousel
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 100);
  const lightness = Math.floor(Math.random() * 100);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
const colors = ['red', 'green', 'black', 'blue', 'pink'];

// Le style du Carousel
const carouselStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
  borderRadius: "20px"
};

// Le style des flèches
const arrowStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  backgroundColor: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer"
};

// Le style des points
const dotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: "white",
  margin: "0 5px"
};

// Le composant Carousel
const Carousel = () => {
// L'index de la couleur courante
  const [current, setCurrent] = React.useState(0);
  const direction = useRef();
  const init = useRef();
  const changedRef = useRef();

  // La fonction pour changer de couleur à gauche
  const goLeft = () => {
    direction.current = 'left';
    setCurrent(current === 0 ? colors.length - 1 : current - 1);
  };

  // La fonction pour changer de couleur à droite
  const goRight = () => {
    direction.current = 'right';

    setCurrent(current === colors.length - 1 ? 0 : current + 1);
  };

  return (
    <div style={carouselStyle}>
      <AnimatePresence initial={false} custom={direction.current}>
        {
          colors.map((color, index) => (index === current &&
            <Slide
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
              }}
              direction={direction.current}
              key={index}
            >
              <div 
                style={{
                  background: color,
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                }}
              />
            </Slide>
          ))
        }
      </AnimatePresence>
      <div style={{ ...arrowStyle, left: "10px" }} onClick={goLeft}>
        {"<"}
        </div>
        <div style={{ ...arrowStyle, right: "10px" }} onClick={goRight}>
        {">"}
      </div>
    </div>
  );
};

const Slide = ({ direction, ...otherProps }) => {
  const variants = {
    enter: direction === "left" ? { transform: 'translateX(100%)' } : { transform: 'translateX(-100%)' },
    center: { transform: 'translateX(0%)' },
    exit: direction === "left" ? { transform: 'translateX(-100%)' } : { transform: 'translateX(100%)' }
  };

  return (
    <motion.div
      initial="enter"
      animate="center"
      exit="exit"
      variants={variants}
      transition={{ 
       type: 'spring',
        stiffness: 500, 
        damping: 50 
      }}
      {...otherProps}
    />
  );
};

export default Carousel;