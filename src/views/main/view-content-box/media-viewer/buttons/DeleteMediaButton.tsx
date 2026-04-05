import { Tooltip, IconButton } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const DeleteMediaButton = () => {
  return (
    <Tooltip title="Supprimer l'image" placement='top' disableFocusListener>
      <span>
        <IconButton onClick={null}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default DeleteMediaButton;
