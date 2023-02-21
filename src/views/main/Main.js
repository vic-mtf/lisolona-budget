import { Toolbar, Box as MuiBox, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import ChatBox from "./chatbox/ChatBox";
import Home from "./home/Home";


export default function Main () {
    const data = useSelector(store => store.data.elements);

    return (
        <MuiBox 
            component="main" 
            sx={{ 
                flexGrow: 1, 
                width: 0, 
            }}
        overflow="hidden"
        >
            <ChatBox/>
            {/* <Home/> */}
        </MuiBox>
    )
}