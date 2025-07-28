import { Skeleton, Box, alpha } from "@mui/material";
import PropTypes from "prop-types";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";

const VideoSkeleton = ({ borderRadius = 2 }) => {
  return (
    <Box
      sx={{
        color: "white",
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius,
        overflow: "hidden",
        backgroundColor: "rgba(0,0,0,0.3)", // Couleur plus ciné
      }}>
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

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 60,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 1,
          overflow: "hidden",
          backgroundColor: (t) => alpha(t.palette.common.white, 0.2),
        }}>
        <PlayArrowOutlinedIcon fontSize='large' />
      </Box>
    </Box>
  );
};

VideoSkeleton.propTypes = {
  borderRadius: PropTypes.number,
};

export default VideoSkeleton;
