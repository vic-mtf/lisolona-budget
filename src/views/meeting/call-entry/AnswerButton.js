import { Fab, Stack, ThemeProvider, createTheme, useTheme } from "@mui/material";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { useData } from "../../../utils/DataProvider";
import { useMeetingData } from "../../../utils/MeetingProvider";
import {  setData } from "../../../redux/meeting";
import { useDispatch, useSelector } from "react-redux";
import Typography from "../../../components/Typography";
import { useSocket } from "../../../utils/SocketIOProvider";
import { useCallback } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import clearTimer from "../../../utils/clearTimer";

export default function AnswerButton () {
    const [{videoStreamRef, audioStreamRef, client}] = useData();
    const [{localTrackRef, ringRef, timerRef}] = useMeetingData();
    const microActive = useSelector(store => store.meeting.micro.active);
    const cameraActive = useSelector(store => store.meeting.camera.active);
    const joined = useSelector(store => store.meeting.joined);
    const mode = useSelector(store => store.meeting.mode);
    const id = useSelector(store => store.meeting.id);
    const socket = useSocket();
    const theme = useTheme();
    const dispatch = useDispatch();

    const handleUserJoin = useCallback(async () => {
        
        if(mode === 'incoming') {
            ringRef.current?.clearAudio();
            clearTimer(timerRef.current);
            socket.emit('join', { id });
            dispatch(setData({
                data : { mode: joined ? 'on' : 'join' }
            }));
            const streams = [];
            if(microActive && audioStreamRef.current) {
                const audioTracks = audioStreamRef.current.getAudioTracks();
                const [mediaStreamTrack] = audioTracks;
                const localAudioTrack = AgoraRTC.createCustomAudioTrack({ mediaStreamTrack })
                localTrackRef.current.audioTrack =  localAudioTrack;
                streams.push(localAudioTrack);
            }
            if(cameraActive && videoStreamRef.current) {
                const videoTracks = videoStreamRef.current.getVideoTracks();
                const [mediaStreamTrack] = videoTracks;
                const localVideoTrack = AgoraRTC.createCustomVideoTrack({ mediaStreamTrack })
                localTrackRef.current.videoTrack =  localVideoTrack;
                streams.push(localVideoTrack);
            }
            if(streams.length && joined)
                await client.publish(streams);
        }
    },[
        joined, 
        id, 
        audioStreamRef, 
        microActive, 
        localTrackRef,
        videoStreamRef,
        cameraActive, 
        mode,
        socket,
        client,
        ringRef,
        timerRef,
        dispatch
    ]);

    return (
        <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            spacing={.5}
            
        >
            <ThemeProvider
                theme={createTheme({
                    palette: {
                        ...theme.palette,
                        primary: {
                            ...theme.palette.primary,
                            main: '#76ff03',
                            dark: '#52b202',
                            light: '#91ff35'
                        }
                    }
                })}
            >
                <Fab
                    size="small"
                    color="primary"
                    onClick={handleUserJoin}
                    sx={{
                        borderRadius: 1,
                        mx: 1,
                    }}
                >
                    <PhoneOutlinedIcon fontSize="small" />
                </Fab>
                <Typography
                    variant="caption" 
                    align="center" 
                    fontSize={10.5}
                    noWrap
                >
                    Repondre
                </Typography>
            </ThemeProvider>
        </Stack>
    )
}