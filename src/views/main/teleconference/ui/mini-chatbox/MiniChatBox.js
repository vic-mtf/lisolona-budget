import { useSelector } from "react-redux";
import Box from "../../../../../components/Box";
import BoxGradient from "../../../../../components/BoxGradient";
import ChatBody from "../../../chatbox/chatbody/ChatBody";
import ChatFooter from "../../../chatbox/chatfooter/ChatFooter";
import NavigationRight from "./navigation/right/NavigationRight";
import { useMemo } from "react";

export default function MiniChatBox ({open}) {
    const target = useSelector(store => store.teleconference.target) || {};
    const messageGrouping = useSelector(store => store.data.messageGrouping);
    const miniChatBoxSavedMessages = useMemo(() => 
        messageGrouping
        ?.find(({targetId}) => targetId === target?.id)
        ?.messages || []
    , [messageGrouping]);
    return (
        <NavigationRight
            anchor="right" 
            variant="persistent" 
            open={open}
            sx={{}}
        >
            <BoxGradient>
                
            <Box
                overflow="hidden"
                height="100%"
            >
                {/* <ChatHeader
                    targetId={targetId}
                /> */}
                <ChatBody 
                    miniChatBoxSavedMessages={miniChatBoxSavedMessages}
                />
                <ChatFooter target={target}/>
            </Box>
            </BoxGradient>
        </NavigationRight>
    )
}
