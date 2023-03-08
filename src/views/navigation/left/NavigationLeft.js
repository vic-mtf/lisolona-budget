import Navigation from '../Navigation';
import { Divider, Stack } from '@mui/material';
import Box from '../../../components/Box';
import Header from './Header';
import ShortcutOptions  from './shortcut/ShortcutOptions';
import { useCallback, useEffect, useRef, useState } from 'react';
import RelatedContactsList from './lists/RelatedContactsList';
import ChatContactsList from './lists/ChatContactsList';
import CallContactsList from './lists/CallContactsList';
import NotificationList from './lists/NotificationList';
import { useSocket } from '../../../utils/SocketIOProvider';
import mssAudio  from '../../../assets/Eventually-Sms.mp3';
import { useDispatch, useSelector } from 'react-redux';
import { addData } from '../../../redux/data';
import getParseData from '../../../utils/getParseData';

export default function NavigationLeft () {
    const [navigation, setNavigation] = useState(0);
    const { chatId, user } = useSelector(store => {
       const chatId = store.data?.chatId;
       const user = store.user;
       return { chatId, user };
    });
    const savedChatIdRef = useRef(chatId);
    const dispatch = useDispatch();
    const Panel = useCallback(({value, children}) => 
        navigation === value && children, [navigation]
    );
    const socket = useSocket();

    useEffect(() => {
        const handelGetChat = ({chats}) => {
            const data = getParseData(chats, user);
            dispatch(addData({
                key: 'data',
                data: {
                    conversations: data,
                    chatGroups: chats?.filter(chatGroup => 
                        chatGroup?.type === 'room'
                    ),
                }
            }))
        };
        const handleSignaling = ({invitations}) => {
            if(invitations?.length) {
                const audio = new Audio();
                audio.src = mssAudio;
                audio.autoplay = true;
            }
        };
        socket?.on('chats', handelGetChat);
        socket?.on('invitations', handleSignaling);
        socket?.emit('direct-chat');
        return () => {
            socket?.off('chats', handelGetChat);
            socket?.off('invitations', handleSignaling);
        };
    }, [socket]);

    useEffect(() => {
        if(chatId !== savedChatIdRef.current) {
            const name = '_user-infos';
            const customEvent = new CustomEvent(name, {
                    detail: {name, state: false}
            });
            document.getElementById('root')
            .dispatchEvent(customEvent);
            savedChatIdRef.current = chatId;
        }
    },[chatId, savedChatIdRef.current])

    return (
        <Navigation
           disableTooBar
        >
            <Stack
                display="flex"
                flex={1}
                direction="row"
                divider={<Divider flexItem orientation="vertical"/>}
                overflow="hidden"
            >
                <Stack 
                    display="flex"
                    width={55}
                    spacing={1}
                    children={<ShortcutOptions/>}
                />
                <Box overflow="hidden">
                    <Header 
                        onChangeNavigation={(event, value) => setNavigation(value)}
                        navigation={navigation}
                    />
                    <Panel value={0}>
                        <ChatContactsList/>
                    </Panel>
                    <Panel value={1}>
                        <CallContactsList/>
                    </Panel>
                    <Panel value={2}>
                        <RelatedContactsList/>
                    </Panel>
                    <Panel value={3}>
                        <NotificationList/>
                    </Panel>
                </Box>
            </Stack>
        </Navigation>
    );
}