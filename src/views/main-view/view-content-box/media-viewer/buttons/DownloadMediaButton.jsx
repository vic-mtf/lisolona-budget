import { Tooltip, IconButton } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const DownloadMediaButton = () => {
  return (
    <Tooltip title="Télécharger l'image" placement='top' disableFocusListener>
      <span>
        <IconButton onClick={null}>
          <FileDownloadOutlinedIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

DownloadMediaButton.propTypes = {};

export default DownloadMediaButton;
