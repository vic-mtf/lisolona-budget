import { useTheme } from "@mui/material";

export default function useBorderRadius ({isFirst, isLast, direction }) {
    const theme = useTheme();
    const radiusLeft = (isFirst && !isLast) || (!isFirst && !isLast) ? 
    theme.spacing(0, 1, 1, 1) :
    theme.spacing(0, 1, 1, 0);
    const radiusRight = (!isFirst && isLast) || (!isFirst && !isLast) ? 
    theme.spacing(1, 1, 0, 1) : theme.spacing(1, 0, 0, 1);
    return direction === 'left' ? radiusLeft : radiusRight;
}