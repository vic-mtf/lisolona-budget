import { Tooltip, IconButton } from "@mui/material";
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

export default CloseButton;
