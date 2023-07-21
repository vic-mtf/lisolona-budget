import { Drawer } from "@mui/material";
import { drawerWidth } from "../conference";
import { useSelector } from "react-redux";
import Members from "./members/Members";

export default function Navigation ({open}) {
    const nav = useSelector(store => store.conference.nav);
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
            {/participant/.test(nav) && <Members />}
        </Drawer>
    )
}