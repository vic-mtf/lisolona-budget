import React, { useState, useEffect } from 'react';
import {
    Box as MuiBox
} from '@mui/material';
import MessageList from './MessageList';
import FloatingDate from './FloatingDate';
import FabButton from './FabButton';


const ChatContainer = ({target}) => {
    const [{messagesRef}] useLocalStoreData();
    const [messages, setMessages] = useState(messagesRef.current[target.id]?.messages?.slice(0, 15).reverse() || []);
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);


    useEffect(() => {
       
        // Charger les messages initiaux et gérer l'ajout de nouveaux messages ici
    }, []);

    const handleScroll = (isAtBottom) => {
        setIsAtBottom(isAtBottom);
        if (isAtBottom) {
        setNewMessagesCount(0);
        }
    };

    return (
        <MuiBox
            display="flex"
            flex={1}
            overflow="hidden"
            bgcolor="red"
        >
            {/* <MessageList messages={messages} onScroll={handleScroll} /> */}
            <FloatingDate />
            {/* {!isAtBottom && <FabButton newMessagesCount={newMessagesCount} />} */}
        </MuiBox>
    );
};

export default ChatContainer;
