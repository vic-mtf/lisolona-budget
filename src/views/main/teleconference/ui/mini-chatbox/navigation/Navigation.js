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
            anchor="right"
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': { 
                    width: drawerWidth, 
                    boxSizing: 'border-box',
                    background: color || 'background.paper',
                },
                zIndex: theme => theme.zIndex.drawer,
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