import { Tooltip, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";

const ZoomButton = ({ zoom, toggleZoom }) => {
  return (
    <Tooltip
      title={zoom ? "Dézoomer" : "Zoomer"}
      placement='top'
      disableFocusListener>
      <span>
        <IconButton onClick={toggleZoom}>
          {zoom ? <ZoomOutOutlinedIcon /> : <ZoomInOutlinedIcon />}
        </IconButton>
      </span>
    </Tooltip>
  );
};

ZoomButton.propTypes = {
  zoom: PropTypes.bool,
  toggleZoom: PropTypes.func,
};

export default ZoomButton;
