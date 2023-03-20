import Box from "../../../../components/Box";
import BoxGradient from "../../../../components/BoxGradient";
import useMessage from "../../../../utils/useMessage";
import ChatBody from "../../../main/chatbox/chatbody/ChatBody";
import ChatFooter from "../../../main/chatbox/chatfooter/ChatFooter";
import NavigationRight from "./navigation/right/NavigationRight";

export default function MiniChatBox ({open}) {
    const groupMessages = useMessage();

    return (
        <NavigationRight
            anchor="right" 
            variant="persistent" 
            open={open}
        >
            <BoxGradient>
            <Box
                overflow="hidden"
                height="100%"
            >
                {/* <ChatHeader
                    chatId={chatId}
                /> */}
                <ChatBody
                    groupMessages={groupMessages}
                />
                <ChatFooter/>
            </Box>
            </BoxGradient>
        </NavigationRight>
    )
}