import { Drawer, Toolbar, Box as MuiBox, useTheme, useMediaQuery } from "@mui/material";

export const drawerWidth = 400;

export default function Navigation ({
    children, 
    toolBarProps, 
    color, 
    disableTooBar, 
    ...otherProps
}) {
    const theme = useTheme();
    
    return (
        <MuiBox
            variant="permanent"
            component={Drawer}
            sx={{
               width: otherProps?.open ? drawerWidth : 0,
                flexShrink: 0,
                '& .MuiDrawer-paper': { 
                    width: drawerWidth, 
                    boxSizing: 'border-box',
                    background: color || 'background.paper'
                },
            }}
            {...otherProps}
        >
            {!disableTooBar &&
            <Toolbar 
                variant="dense"
                {...toolBarProps}
            />}
            {children}
        </MuiBox>
    )
}