import { List } from "@mui/material";
import Box from "../../../../components/Box";
import scrollBarSx from "../../../../utils/scrollBarSx";
import useScrollEnd from "../../../../utils/useScrollEnd";
import useShadow from "./useShadow";

export default function Lists ({children, onScrollEnd, sx, ...otherProps}) {
    const [atEnd, scrollProps] = useScrollEnd({
        onScrollEnd, 
        type: 'top',
        margin: 50,
    });
    const shadow = useShadow();

    return (
        <Box 
            overflow="hidden" 
            sx={{
                boxShadow: atEnd ? 0 : shadow,
            }}
        >
            <List
                dense
                {...scrollProps}
                {...otherProps}
                sx={{
                    overflow: 'auto',
                    height: "100%",
                    width: 'auto',
                    ...scrollBarSx,
                    ...sx,
                }}
            >
                {children}
            </List>
        </Box>
    );
}