import ChatHeader from './chat-header/ChatHeader';
import ChatBody from './chat-body/ChatBody';
import ChatFooter from './chat-footer/ChatFooter';
import ChatFooterBeta from './chat-footer-beta/ChatFooter';
import Box from '../../../components/Box';
import { useSelector } from 'react-redux';
import ChatArea from './chat-area/ChatArea';
import { useData } from '../../../utils/DataProvider';
import { useMemo } from 'react';

export const MESSAGE_CHANNEL = document.createElement('div');

export default function ChatBox () {
    const target = useSelector(store => store?.data?.target);
    const [{messagesRef}] = useData();
    const messages = useMemo(() => 
        messagesRef.current[target?.id]?.messages, 
        [target, messagesRef]
    );

    return (
        <Box
            overflow="hidden"
            height="100%"
            key={target?.id}
        >
            <ChatHeader target={target}/>
            {/* <ChatBody target={target}/> */}
            <ChatArea 
                target={target}
                messages={messages}
            />
            <ChatFooterBeta target={target} media/>
            {/* <ChatFooter target={target}/> */}
        </Box>
    );
}

