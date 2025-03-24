import { Tooltip, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const CloseButton = ({ onClose }) => {
  return (
    <Tooltip title='Fermer' placement='top' disableFocusListener>
      <span>
        <IconButton onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

CloseButton.propTypes = {
  onClose: PropTypes.func,
};

export default CloseButton;
