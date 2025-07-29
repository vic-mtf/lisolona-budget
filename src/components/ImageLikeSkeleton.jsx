import { Skeleton, Box } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
//import imgSrc from "../assets/log-image.jpg";

const ImageLikeSkeleton = React.forwardRef(
  ({ borderRadius = 2, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          borderRadius,
          overflow: "hidden",
        }}>
        {/* Skeleton animé */}
        <Skeleton
          variant='rectangular'
          animation='wave'
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius,
          }}
        />
        {/* <img
        src={imgSrc}
        alt='image'
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          opacity: 0.3,
          //backdropFilter: "blur(10px)",
          filter: "blur(10px)",
        }}
      /> */}

        {/* Icône SVG responsive centrée */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            maxWidth: "70%",
            maxHeight: "70%",
            aspectRatio: "1 / 1",
            color: "#ccc",
          }}>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={{
              width: "100%",
              height: "100%",
              display: "block",
            }}>
            <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
            <circle cx='8.5' cy='8.5' r='1.5' />
            <path d='M21 15l-5-5L5 21' />
          </svg>
        </Box>
      </Box>
    );
  }
);

ImageLikeSkeleton.displayName = "ImageLikeSkeleton";

ImageLikeSkeleton.propTypes = {
  borderRadius: PropTypes.number,
};

export default ImageLikeSkeleton;
