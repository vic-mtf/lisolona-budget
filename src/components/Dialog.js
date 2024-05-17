import { styled, Dialog as MuiDialog } from "@mui/material";

const Dialog = styled(MuiDialog)(({ theme }) => ({
   "& > .MuiBackdrop-root": { 
        backgroundColor: theme.palette.background.paper +
        theme.customOptions.opacity,
        backdropFilter: `blur(${theme.customOptions.blur})`
    }
}));

export default Dialog;