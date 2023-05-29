import * as React from 'react';
import { 
    Box, List,
} from "@mui/material";

const useScrollTop = () => {
    const [scrollTop, setScrollTop] = React.useState(0);
    const onScroll = (event) => setScrollTop(event.target.scrollTop);
    return [scrollTop, { onScroll }];
  }

const BoxScrollShadow = ({children,sx, ...otherProps}) => {
    const [scrollTop, scrollProps] = useScrollTop();
    
    return (
        <Box
            {...scrollProps}
            {...otherProps}
            component={List}
            sx={{
                boxShadow: theme =>
                scrollTop > 0 ? `inset 0 3px 5px -2.5px ${theme.palette.divider}` : "none",
                transition: "box-shadow 0.2s",
                overflow: "auto",
                ...sx,
            }}
        >
            {children}
        </Box>
    )
}

export default BoxScrollShadow;