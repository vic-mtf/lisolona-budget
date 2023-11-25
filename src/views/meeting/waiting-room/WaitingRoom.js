import { Box as MuiBox, Backdrop, LinearProgress } from '@mui/material'
import HardwareTesting from './hardware-testing/HardwareTesting';
import MeetingBoard from './meeting-board/MeetingBoard';
import { useMeetingData } from '../../../utils/MeetingProvider';
import { useSocket } from '../../../utils/SocketIOProvider';
import useJoinMeeting from '../actions/useJoinMeeting';
import React, { useCallback, useEffect, useState } from 'react';
import Typography from '../../../components/Typography';
import store from '../../../redux/store';
import { setData } from '../../../redux/meeting';

export default function WaitingRoom () {
    const [ {origin, mode }] = useMeetingData();
    const socket = useSocket();
    const handleJoinMeeting = useJoinMeeting();
    const [loadingType, setLoadingType] = useState(null);

    const handleAskJoinMeeting = useCallback(() => {
        setLoadingType('loading');
        if(mode === 'guest')
            socket.emit('join', {
                id: origin._id,
            });
        else handleJoinMeeting().then(() => {

        });
    },[origin, socket, mode, handleJoinMeeting]);

    useEffect(() => {

        const onGuestWaiting = ({where}) => {
            if(origin._id === where?._id) {
                setLoadingType('waiting'); 
                store.dispatch(
                    setData({
                        data: {
                            me: store.getState().user,
                        }
                    })
                )
            }
        };
        const onJoinMeeting = ({where}) => {
            handleJoinMeeting(where?._id, mode !== 'guest').then((data) => {
                setLoadingType(null);
                store.dispatch(setData({data: {mode: 'on'}}))
            });
        };
        const onError = event => {
            console.log(event);
        };
        socket.on('guest', onGuestWaiting);
        socket.on('join', onJoinMeeting);
        socket.on('error', onError);

        return () => {
            socket.off('guest', onGuestWaiting);
            socket.off('join', onJoinMeeting);
            socket.off('error', onError);

        };
    },[socket, handleJoinMeeting, origin, mode]);

    return (
        <>
        <MuiBox  
            minHeight="100%"
            width="100%"
            gap={1}
            display="flex"
            flex={1}
            sx={{
                flexDirection: {
                    md: 'row',
                    xs: 'column',
                }
            }}
        >
            <MuiBox
                display="flex"
                justifyContent="end"
                alignItems="center"
                sx={{
                    width: "100%",
                    flex: {
                        xs: 1,
                        md: 12/5.5,
                        lg: 12/5
                    }
                }}
            >
                <HardwareTesting/>
            </MuiBox>
            <MuiBox
                display="flex"
                justifyContent="start"
                alignItems="center"
                sx={{
                    width: "100%",
                    flex: {
                        xs: 1,
                        md: 12/6.5,
                        lg: 12/7
                    }
                }}
            >
                <MeetingBoard
                    handleAskJoinMeeting={handleAskJoinMeeting}
                />
            </MuiBox>
        </MuiBox>
        <Backdrop
            open={Boolean(loadingType)}
            sx={{
                background: theme => theme.palette.background.paper + 
                theme.customOptions.opacity,
                zIndex: theme => theme.zIndex.drawer + 100,
                ...loadingType === "waiting" ? {
                    backdropFilter:  theme =>  `blur(${theme.customOptions.blur})`
                }: {}
            }}
            children={
                <React.Fragment>
                    <LinearProgress
                        sx={{
                            width: '100%',
                            position: 'absolute',
                            top: 0,
                            
                        }} 
                    />
                    {<Typography
                        variant="h5"
                        maxWidth={700}
                        align="center"
                    >{messages[loadingType]}</Typography>}
                </React.Fragment>
            }
        />
    </>
    );

}

const messages = {
    loading: "Préparation en cours... Veuillez patienter.",
    waiting: `
    Nous traitons votre demande pour rejoindre la réunion. 
    Veuillez patienter pendant que nous vérifions les détails. 
    L'autorisation de l'hôte est requise. Merci de votre patience !`,
};