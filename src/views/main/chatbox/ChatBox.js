import ChatHeader from './chatheader/ChatHeader';
import ChatBody from './chatbody/ChatBody';
import ChatFooter from './chatfooter/ChatFooter';
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
            <ChatFooter target={target}/>
        </Box>
    );
}

