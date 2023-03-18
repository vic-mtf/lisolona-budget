import { 
    AvatarGroup,
    Box as MuiBox,
    Avatar,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import Typography from '../../../components/Typography';
import waitSong from '../../../assets/mixkit-on-hold-ringtone-1361.wav';
import RignSon from '../../../assets/ring-tone-68676.mp3';
import ringingSong from '../../../assets/Halloween-Cradles.mp3';
import unansweredSong from '../../../assets/textnotific_f57e30705281695.mp3';
import rejectedSong from '../../../assets/textnot_6edac1824932819.mp3';
import React, { useEffect, useMemo, useState } from 'react';
import useAxios from '../../../utils/useAxios';
import { useSelector } from 'react-redux';
import { useSocket } from '../../../utils/SocketIOProvider';
import { useTeleconference } from '../../../utils/useTeleconferenceProvider';

export default function CallStatus () {
    const [connected, setConnected] = useState(false);
    const { options, setOptions, pickedUp, setPickedUp, status } = useTeleconference();
    const socket = useSocket();
    const audio = useMemo(() => new Audio(), []);
    const { 
        token, members, name, type, variant, callType, clientId
    } = useSelector(store => {
    const token = store.user?.token;
    const clientId = store.teleconference?.clientId;
    const contact = store.data?.contacts?.find(({id}) => id === clientId) ||
    store.data.conversations?.find(({id}) => id === clientId);
    const name = contact?.name;
    const type =  contact?.type || 'direct';
    const members = contact?.origin?.members
    ?.filter(({_id: user}) => store.user?.id !== user?._id)
    ?.map(({_id: user, role}) => ({
            ...user,
            role,
            id: user?._id,
            origin: user,
            name: `${user?.fname || ''} ${ user?.lname || ''} ${user?.mname || ''}`.trim(),
    })) || [contact]
    const variant = store?.teleconference?.variant;
    const callType = store?.teleconference?.type;
    return {
        token, members, name, type, variant, callType, clientId
    };
    });
    const [,refetch] = useAxios(
    {   
        url: `/api/chat/rtc/${type}/${clientId}/publisher/uid`,
        headers: {'Authorization': `Bearer ${token}`}
    },
    {manual: true}
    );
    useEffect(() => {
    switch(variant) {
        case 'outgoing': 
            if(status === 'calling')  {
                if (connected) audio.src = RignSon;
                else audio.src = waitSong;
            }
            if(status === 'unanswered')
                audio.src = unansweredSong;
            if(status === 'rejected')
                audio.src = rejectedSong;
            break;
        default:  audio.src = ringingSong;;
    }
    audio.loop = true;
    audio.autoplay = true;
    if(pickedUp) {
        audio.pause();
        audio.src = null;
    }
    return () => {
        audio.pause();
        audio.src = null;
    }
    }, [connected, variant, pickedUp, status, audio]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if(variant === 'outgoing')
                refetch().then(({data}) => {
                    setOptions({
                        token: data?.TOKEN,
                        appId: data?.APP_ID,
                        channel: clientId,
                        uid: data?.UID,
                    });
                });
        }, 3000);
        return () => {
            window.clearTimeout(timer);
        }
    }, [refetch, clientId, setOptions, variant]);

    useEffect(() => {
        const hanldeConnexion = ({connected}) => {
            if(connected) {
                setConnected(true);
            }
        };
        const handleAutoHangUpCall = () => {
            if(variant === 'outgoing' && !pickedUp)
                setPickedUp(true);
        }
        socket?.on('pick-up', handleAutoHangUpCall);
        socket?.on('call-in-progress', hanldeConnexion);
        return () => {
            socket?.off('call-in-progress', hanldeConnexion);
            socket?.off('pick-up', handleAutoHangUpCall);
        }
    }, [socket, setPickedUp, variant, pickedUp]);

    useEffect(() => {
        if(options && !pickedUp && variant === 'outgoing') 
            socket?.emit('call', {
                target: clientId,
                type,
                details: { 
                    options, 
                    variant,
                    type: callType,
                }
            });
    },[socket, options, variant, callType, clientId, type, pickedUp]);

    return (
        <MuiBox
            position="absolute"
            top={0}
            height="100%"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <MuiBox>
                <AvatarGroup
                    total={members?.length}
                    sx={{
                        "& .MuiAvatarGroup-avatar": {
                            width: 100,
                            height: 100,
                            fontSize: 40,
                        },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {members?.map((member, index) => 
                        <Avatar 
                            key={index}
                            children={member?.name?.charAt(0)}
                        />
                    )}
                </AvatarGroup>
                <ThemeProvider theme={createTheme({palette: {mode: 'dark' }})}>
                    {type === 'room' &&
                    <Typography 
                        noWrap 
                        align="center" 
                        variant="caption" 
                        maxWidth="100%" 
                    >
                        {members.map(({name}) => name).join(', ')}
                    </Typography>}
                    <Typography align="center" variant="h5" paragraph>
                        {name}
                    </Typography>
                    {status === 'calling' &&
                    <React.Fragment>
                        {variant === 'outgoing' ?
                        <Typography align="center" paragraph>
                            {connected ? 'Entrain de sonner' : 'Connexion en cours...'}
                        </Typography>: 
                        <Typography align="center" paragraph>
                            Appel entrant
                        </Typography>}
                    </React.Fragment>}
                    {status === 'unanswered' &&
                    <Typography align="center" paragraph>
                        Pas de reponse
                    </Typography>
                    }
                    {status === 'rejected' &&
                    <Typography align="center" paragraph>
                        Appel réjeté
                    </Typography>
                    }
                </ThemeProvider>
            </MuiBox>
        </MuiBox>
    )
}