import {

} from '@mui/material';
import React from 'react';
import ChatHeader from './chatheader/ChatHeader';
import ChatBody from './chatbody/ChatBody';
import ChatFooter from './chatfooter/ChatFooter';
import Box from '../../../components/Box';
import useMessage from '../../../utils/useMessage';

export default function ChatBox ({chatId}) {
    const groupMessages = useMessage();
    
    return (
        <Box
            overflow="hidden"
            height="100%"
        >
            <ChatHeader
                chatId={chatId}
            />
            <ChatBody
                groupMessages={groupMessages}
            />
            <ChatFooter/>
        </Box>
    );
}