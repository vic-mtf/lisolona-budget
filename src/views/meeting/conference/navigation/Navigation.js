import { Drawer, Toolbar } from "@mui/material";
import { drawerWidth } from "../conference";
import { useSelector } from "react-redux";
import Members from "./members/Members";
import ChatBox from "./chat-box/ChatBox";
import ActionWrapper from "../../../main/action/ActionWrapper";
import { useMeetingData } from "../../../../utils/MeetingProvider";

export default function Navigation ({open}) {
    const nav = useSelector(store => store.conference.nav);
    const [{target}] = useMeetingData();

    console.log('****** :',target);

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
            {/message/.test(nav) && <ChatBox />}
            <Toolbar/>
            <ActionWrapper targetId={target.id}/>
        </Drawer>
    )
}