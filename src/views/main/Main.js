import { Toolbar, Box as MuiBox, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import useMessage from "../../utils/useMessage";
import ChatBox from "./chatbox/ChatBox";
import Home from "./home/Home";
import { drawerWidth } from "../navigation/Navigation";

export default function Main ({open}) {
    const chatId = useSelector(store => store.data.chatId);
    const groupMessages = useMessage();

    return (
        <MuiBox 
            component="main" 
            overflow="hidden"
            sx={{ 
                flexGrow: 1, 
                width: 0, 
                mr: open ? 0 : -drawerWidth / 8,
                transition: theme => theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            }}
        >
           {chatId ?
            <ChatBox
                chatId={chatId}
                groupMessages={groupMessages}
            /> :
            <Home/>}
        </MuiBox>
    )
}