import { Drawer, Toolbar } from "@mui/material";
import { drawerWidth } from "../conference";

export default function Navigation ({open}) {
    
    return (
        <Drawer
            variant="persistent"
            anchor="right"
            open={open}
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
                width: drawerWidth, 
                boxSizing: 'border-box',
                bgcolor: 'transparent',
            },
            }}
        >
            
            <Toolbar />
        </Drawer>
    )
}