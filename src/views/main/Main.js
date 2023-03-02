import { Toolbar, Box as MuiBox, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import ChatBox from "./chatbox/ChatBox";
import Home from "./home/Home";


export default function Main () {
    const chatId = useSelector(store => store.data.chatId);

    return (
        <MuiBox 
            component="main" 
            sx={{ 
                flexGrow: 1, 
                width: 0, 
            }}
        overflow="hidden"
        >
           {chatId ?
            <ChatBox
                chatId={chatId}
            /> :
            <Home/>}
        </MuiBox>
    )
}