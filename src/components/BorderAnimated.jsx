import Box from "@mui/material/Box";
import { alpha } from "@mui/system";

const BorderAnimated = () => {
  return (
    <Box position='absolute' width='100%' height='100%' zIndex={0}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          "@keyframes rotate": {
            from: { transform: "rotate(0deg)" },
            to: { transform: "rotate(360deg)" },
          },
          "&::before": {
            content: '""',
            display: "block",
            background: (t) =>
              `linear-gradient(90deg, transparent 0%, ${alpha(
                t.palette.primary.main,
                0.75
              )} 50%, transparent 100%)`,
            width: "100%",
            height: "100%",
            transform: "translate(0)",
            position: "absolute",
            animation: "rotate 5s linear forwards infinite",
            zIndex: 0,
            top: "50%",
            transformOrigin: "top center",
          },
        }}></Box>
    </Box>
  );
};

export default BorderAnimated;
