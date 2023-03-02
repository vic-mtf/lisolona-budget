import Navigation from '../Navigation';
import { Divider, Stack } from '@mui/material';
import Box from '../../../components/Box';
import Header from './Header';
import ShortcutOptions  from './shortcut/ShortcutOptions';
import { useCallback, useEffect, useState } from 'react';
import RelatedContactsList from './lists/RelatedContactsList';
import ChatContactsList from './lists/ChatContactsList';
import CallContactsList from './lists/CallContactsList';
import NotificationList from './lists/NotificationList';
import { useSocket } from '../../../utils/SocketIOProvider';
import mssAudio  from '../../../assets/Eventually-Sms.mp3';

export default function NavigationLeft () {
    const [navigation, setNavigation] = useState(0);
    const Panel = useCallback(({value, children}) => 
        navigation === value && children, [navigation]
    );
    const socket = useSocket();

    useEffect(() => {
        socket.on('invitations', ({invitations}) => {
            if(invitations?.length){
                const audio = new Audio();
                audio.src = mssAudio;
                audio.autoplay = true;
            }
        });
    },[socket]);

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