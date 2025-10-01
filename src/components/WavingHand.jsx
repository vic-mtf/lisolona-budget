import { motion } from "framer-motion";
import MuiBox from "@mui/material/Box";
import FrontHandOutlinedIcon from "@mui/icons-material/FrontHandOutlined";

const Box = motion.create(MuiBox);

const WavingHand = () => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        originY: 1,
        color: (t) => t.palette.text.primary,
      }}
      animate={{
        //y: [20, 0, 0, 0, 20],
        rotate: [0, 25, -20, 25, -20, 0],
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        repeatDelay: 0.5,
      }}>
      <FrontHandOutlinedIcon fontSize='small' />
    </Box>
  );
};

export default WavingHand;
