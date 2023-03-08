import {

} from '@mui/material';
import React from 'react';
import ChatHeader from './chatheader/ChatHeader';
import ChatBody from './chatbody/ChatBody';
import ChatFooter from './chatfooter/ChatFooter';
import Box from '../../../components/Box';

export default function ChatBox ({groupMessages, chatId}) {
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