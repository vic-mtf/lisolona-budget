import { styled, ToggleButton } from "@mui/material";

const IconButton = styled(ToggleButton)(() => ({
   // textTransform: 'none',
   border: 'none',
}));

export default IconButton;
IconButton.defaultProps = {
   size: 'small',
   value: ''
};