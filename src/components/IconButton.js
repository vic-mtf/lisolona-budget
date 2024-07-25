import { styled, ToggleButton } from "@mui/material";

const IconButton = styled((props) => (
  <ToggleButton size='small' value='' {...props} />
))(() => ({
  // textTransform: 'none',
  border: "none",
  "&:disabled": {
    border: "none",
  },
}));

export default IconButton;
