import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseFullscreenOutlinedIcon from "@mui/icons-material/CloseFullscreenOutlined";
import Tooltip from "@mui/material/Tooltip";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import PropTypes from "prop-types";

const ViewOptions = ({ onReduced, onAddToGrid }) => {
  return (
    <Box
      className='viewOptions'
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "center",
        alignItems: "center",
        transform: "translate(-50%, -50%)",
        p: 0.5,
        borderRadius: 1,
        top: "50%",
        left: "50%",
        position: "absolute",
        color: "#fff",
        bgcolor: (t) => alpha(t.palette.common.black, 0.6),
        transition: (t) =>
          t.transitions.create("opacity", {
            easing: t.transitions.easing.easeInOut,
            duration: t.transitions.duration.leavingScreen,
          }),
        zIndex: (t) => t.zIndex.tooltip,
      }}>
      <Tooltip title='Ajouter dans la grille'>
        <div>
          <IconButton size='small' onClick={onAddToGrid}>
            <CoPresentOutlinedIcon fontSize='small' />
          </IconButton>
        </div>
      </Tooltip>

      <Tooltip title='Réduire'>
        <div>
          <IconButton size='small' onClick={onReduced}>
            <CloseFullscreenOutlinedIcon fontSize='small' />
          </IconButton>
        </div>
      </Tooltip>
    </Box>
  );
};

ViewOptions.propTypes = {
  onReduced: PropTypes.func,
  onAddToGrid: PropTypes.func,
};

export default ViewOptions;
