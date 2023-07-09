import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function Hoverable({ rootRef, children }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    const handleMouseEnter = () => {
      if(!isHovering) setIsHovering(true);
    }

    const handleMouseLeave = () => {
      if(isHovering) setIsHovering(false);
      if(isMoving) setIsMoving(false);
      clearTimeout(timeoutIdRef.current);
    }

    const handleMouseMove = () => {
      if(!isMoving) setIsMoving(true);
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 2000);
    }

    const rootElement = rootRef.current;
    rootElement.addEventListener('mouseenter', handleMouseEnter);
    rootElement.addEventListener('mouseleave', handleMouseLeave);
    rootElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      rootElement.removeEventListener('mouseenter', handleMouseEnter);
      rootElement.removeEventListener('mouseleave', handleMouseLeave);
      rootElement.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutIdRef.current);
    };
  }, [rootRef]);

  return (
    <>
      {
      //children
      }
      {isHovering && !isMoving && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
