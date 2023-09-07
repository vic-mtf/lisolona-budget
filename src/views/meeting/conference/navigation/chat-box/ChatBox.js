import {
    Box as MuiBox, Toolbar
} from '@mui/material';
import Box from "../../../../../components/Box";
import ChatBody from "../../../../main/chat-box/chat-body/ChatBody";
import ChatFooter from "../../../../main/chat-box/chat-footer/ChatFooter";
import ChatHeader from "../../../../main/chat-box/chat-header/ChatHeader";
import Typography from '../../../../../components/Typography';
import { useMeetingData } from '../../../../../utils/MeetingProvider';

export default function ChatBox () {
    const [{target}] = useMeetingData();

    return (
        <>
            <Toolbar variant="dense">
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >Messages</Typography>
            </Toolbar>
            <MuiBox
                display="flex"
                flex={1}
                overflow="hidden"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
            >
               
                <Box
                    height="100%" 
                    overflow="auto"
                    component="div"
                >
                    <ChatBody target={target} media={false}/>
                </Box>
                <MuiBox
                    overflow="hidden"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                >
                    <ChatFooter target={target} media={false} toolbar={false}/>
                </MuiBox>
            </MuiBox>
        </>
    )
}