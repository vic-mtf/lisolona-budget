import { Box as MuiBox } from "@mui/material";
import { useSelector } from "react-redux";
import ChatBox from "./chat-box/ChatBox";
import Home from "./home/Home";
import { drawerWidth } from "../navigation/Navigation";
import React, { useMemo } from "react";
import ActionWrapper from "./action/ActionWrapper";
import ActionsWrapper from "./action/ActionsWrapper";

export default function Main () {
    return (
        <MuiBox 
            component="main" 
            overflow="hidden"
            height="100vh"
            sx={{ 
                flexGrow: 1, 
                width: 0, 
                ml: drawerWidth / 8,
                transition: theme => theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}
        >
            <ChatWrapper/>
            <ActionWrapper/>
            <ActionsWrapper/>
        </MuiBox>
    )
}

const ChatWrapper = () => {
    const target = useSelector(store => store.data?.target);
    const open = useMemo(() => Boolean(target), [target]);
    return (open ? <ChatBox /> : <Home/>);
}

