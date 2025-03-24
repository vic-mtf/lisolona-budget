import React from "react";
import { Box, styled } from "@mui/material";
import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";

// Styled component pour l'animation
const AnimatedHand = styled(Box)(({ theme }) => ({
  animation: "wave 2s infinite",
  // transformOrigin: "70% 70%",
  display: "inline-block",
  "@keyframes wave": {
    "0%": { transform: "rotate(0deg)" },
    "10%": { transform: "rotate(20deg)" },
    "20%": { transform: "rotate(-8deg)" },
    "30%": { transform: "rotate(20deg)" },
    "40%": { transform: "rotate(-4deg)" },
    "50%": { transform: "rotate(10deg)" },
    "60%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(0deg)" },
  },
}));

const HandWave = () => {
  return (
    <div>
      <AnimatedHand sx={{ bgcolor: "red", height: "auto" }}>
        <WavingHandOutlinedIcon fontSize='large' />
      </AnimatedHand>
    </div>
  );
};

export default HandWave;
