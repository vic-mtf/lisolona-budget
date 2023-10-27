import { Box as MuiBox, Stack, useTheme } from '@mui/material';
import Avatar from "../../../components/Avatar";
import CallingMessage from './CallingMessage';
import Typography from '../../../components/Typography';
import { generateColorsFromId } from "../../../utils/genColorById";
import { useLayoutEffect, useMemo } from 'react';
import { useMeetingData } from '../../../utils/MeetingProvider';
import getShort from '../../../utils/getShort';
import useRinging from './answers/useRinging';
import useBusy from './answers/useBusy';
import useDisconnect from './answers/useDisconnect';
import { useSocket } from '../../../utils/SocketIOProvider';
import useJoin from './answers/useJoin';


export default function CallingState ({callState, setCallState}) {
    const [{meetingData}] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target])
    const theme = useTheme();
    const socket = useSocket();
    const { background, text } = generateColorsFromId(target?.id, theme.palette.mode);
    const mode = meetingData?.mode;

    console.log(meetingData);

    const avatarSx = useMemo(() => ({
        color: text,
        bgcolor: background,
        fontWeight: 'bold',
        fontSize: 40,
    }), [background, text]);

    useRinging(callState, setCallState);
    useBusy(callState, setCallState);
    useDisconnect(callState, setCallState);
    useJoin(callState, setCallState);

    useLayoutEffect(() => {
        const onError = event => {
            console.log('error de server socket : ', event);
        };
        socket.on('error', onError);
        return () => {
            socket.off('error', onError);
        }
    }, [socket]);

    return (
        
            <Stack
                spacing={1}
                display="flex"  
                justifyContent="center"
                alignItems="center"
                position="fixed"
                flex={1}
                height="100%"
                width="100%"
                top={0}
                left={0}
                zIndex={10}
                direction="column"
                sx={{
                    background: theme => `linear-gradient(to bottom, transparent , ${
                        theme.palette.background.paper + '50'
                    })`
                }}
            >
                <MuiBox
                    sx={{
                        position: 'relative',
                        m: 5,
                        '& .wave': {
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            width: '100%',
                            background: avatarSx.color,
                            borderRadius: 1,
                            animation: `wave-${
                                mode === 'outgoing' ? 'out' : 'in' 
                            } 1.5s ease-out infinite`,
                            zIndex: -1,
                          },
                          '@keyframes wave-out': {
                            '0%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                            '100%': {
                              transform: 'scale(2)',
                              opacity: 0,
                            },
                          },
                          '@keyframes wave-in': {
                            '0%': {
                              transform: 'scale(2)',
                              opacity: 0,
                            },
                            '100%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                          },
                    }}
                >
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            ...avatarSx,
                            borderColor: avatarSx.color,
                        }}
                        src={target?.avatarSrc}
                        children={getShort(target?.name)}
                    />
                    {callState !== 'before' &&
                    <MuiBox
                        className="wave"
                    />}
                </MuiBox>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    {target?.name}
                </Typography>
                <CallingMessage
                    callState={callState}
                />
            </Stack>
    );
}