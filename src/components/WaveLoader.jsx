import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import useElementSize from "../hooks/useElementSize"; // ou useElementSize

const BAR_WIDTH = 4;
const GAP = 4;

const WaveLoader = React.forwardRef((props, ref) => {
  const [parentRef, size] = useElementSize();
  const { width = 0 } = size;

  const barCount = useMemo(() => {
    return Math.floor(width / (BAR_WIDTH + GAP));
  }, [width]);

  return (
    <Box
      ref={(node) => {
        [parentRef, ref].forEach((r) => {
          if (typeof r === "function") r(node);
          else if (r && Object.prototype.hasOwnProperty.call(r, "current"))
            r.current = node;
        });
      }}
      {...props}
      sx={{
        display: "flex",
        gap: `${GAP}px`,
        alignItems: "center",
        height: "100%",
        width: "100%",
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
      {Array.from({ length: barCount }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: `${BAR_WIDTH}px`,
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
