import { ToggleButton, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import AddLinkOutlinedIcon from "@mui/icons-material/AddLinkOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";

const AddLinkButton = ({ isLink, onOpenAddLink }) => {
  const title = `${isLink ? "Modifier" : "Ajouter"} le lien`;
  return (
    <Tooltip title={title} enterDelay={700} placement='top'>
      <div>
        <ToggleButton
          value='link'
          onClick={onOpenAddLink}
          onMouseDown={(event) => event.preventDefault()}>
          {isLink ? (
            <InsertLinkOutlinedIcon fontSize='small' />
          ) : (
            <AddLinkOutlinedIcon fontSize='small' />
          )}
        </ToggleButton>
      </div>
    </Tooltip>
  );
};

AddLinkButton.propTypes = {
  isLink: PropTypes.bool,
  onOpenAddLink: PropTypes.func.isRequired,
};

export default AddLinkButton;
