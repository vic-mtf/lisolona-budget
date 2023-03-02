import {
    Box as MuiBox, Chip
} from '@mui/material';
import { useEffect, useRef } from 'react';
import scrollBarSx from '../../../../utils/scrollBarSx';
import MessageGroupBox from './messagebox/MessageGroupBox';
import useMessage from '../../../../utils/useMessage';
import { useSelector } from 'react-redux';
import { useSocket } from '../../../../utils/SocketIOProvider';

export default function ChatBody () {
    const rootElRef = useRef();
    const groupMessages = useMessage();
    const chatId = useSelector(store => store.data?.chatId);
    const socket = useSocket();
    useEffect(() => {
        const root = rootElRef.current;
        if(chatId)
            root.scrollTop = root?.scrollHeight;
    }, [rootElRef.current, chatId]);

    useEffect(() => {
        const handleScrool = () => {
            const root = rootElRef.current;
            const top = root?.scrollHeight;
            root?.scrollTo({
                top,
                behavior: "smooth",
              });
        };
        socket?.on('direct-chat', handleScrool);

        return () => {
            socket?.off('direct-chat', handleScrool)
        };
    },[rootElRef.current, socket]);

    return (
        <MuiBox
            overflow="auto"
            px={5}
            flexGrow={1}
            height={0}
            ref={rootElRef}
            sx={{
                ...scrollBarSx,
            }}
        >
            <MuiBox my={2}>
            <MuiBox 
                my={1} 
                justifyContent="center" 
                display="flex"
            >
                <Chip
                    label={`Commencez une nouvelle conversation`}
                />
            </MuiBox>
                {
                    groupMessages.map(({date, messages, fullTime}) => (
                        <MessageGroupBox
                            date={date}
                            messages={messages}
                            key={fullTime}
                        />
                    ))
                }
            </MuiBox>
        </MuiBox>
    )
}


// cond for group hideAvatar  messages[index + 1]?.userId === message?.userId
// cond for joinBox messages[index - 1]?.userId === message?.userId