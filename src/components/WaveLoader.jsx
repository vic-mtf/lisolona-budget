import React from "react";
import Box from "@mui/material/Box";

const WaveLoader = React.forwardRef((props, ref) => {
  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        "@keyframes wave": {
          "0%": {
            transform: "scaleY(1)",
            opacity: 0.5,
          },
          "50%": {
            transform: "scaleY(2)",
            opacity: 1,
          },
          "100%": {
            transform: "scaleY(1)",
            opacity: 0.5,
          },
        },
      }}>
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 4,
            height: `${10 + Math.random() * 10}px`,
            backgroundColor: (t) => t.palette.action.disabled,
            borderRadius: 1,
            animation: "wave 1s infinite ease-in-out",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </Box>
  );
});

WaveLoader.displayName = "WaveLoader";

export default WaveLoader;
