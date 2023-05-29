import { useTheme } from "@mui/material";

export const useBorderRadius = (radius = 1, isMine, joinBox) => {
    const theme = useTheme();
    return isMine ? 
    theme.spacing(radius, joinBox ?  0 : radius, 0, radius) : 
    theme.spacing(joinBox ? 0 : radius, radius, radius, 0);
}