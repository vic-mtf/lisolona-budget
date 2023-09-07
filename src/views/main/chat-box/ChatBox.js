import ChatHeader from './chat-header/ChatHeader';
import ChatBody from './chat-body/ChatBody';
import ChatFooter from './chat-footer/ChatFooter';
// import ChatFooterBeta from './chat-footer-beta/ChatFooter';
import Box from '../../../components/Box';
import { useSelector } from 'react-redux';

export default function ChatBox () {
    const target = useSelector(store => store?.data?.target);
    return (
        <Box
            overflow="hidden"
            height="100%"
        >
            <ChatHeader target={target}/>
            <ChatBody target={target}/>
            {/* <ChatFooterBeta target={target}/> */}
            <ChatFooter target={target}/>
        </Box>
    );
}

