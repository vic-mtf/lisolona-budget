import {

} from '@mui/material';
import React from 'react';
import ChatHeader from './chatheader/ChatHeader';
import ChatBody from './chatbody/ChatBody';
import ChatFooter from './chatfooter/ChatFooter';
import Box from '../../../components/Box';

export default function ChatBox () {
    return (
        <Box
            overflow="hidden"
            height="100%"
        >
            <ChatHeader/>
            <ChatBody/>
            <ChatFooter/>
        </Box>
    );
}