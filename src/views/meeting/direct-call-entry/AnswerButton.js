import { Fab, Stack, ThemeProvider, createTheme, useTheme } from "@mui/material";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { useData } from "../../../utils/DataProvider";
import { getUserUidById, useMeetingData } from "../../../utils/MeetingProvider";
import {  setData } from "../../../redux/meeting";
import { useSelector } from "react-redux";
import Typography from "../../../components/Typography";
import { useSocket } from "../../../utils/SocketIOProvider";
import { useCallback, useLayoutEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import clearTimer from "../../../utils/clearTimer";
import store from "../../../redux/store";
import useJoinedAndPublishedLocalClient from "../actions/useJoinedAndPublishedLocalClient";
import { updateParticipantState } from "../../../redux/conference";

export default function AnswerButton () {
    const [{videoStreamRef, audioStreamRef, client}] = useData();
    const [{localTrackRef, ringRef, timerRef}] = useMeetingData();
    const mode = useSelector(store => store.meeting.mode);
    const userId = useSelector(store => store.user.id);
    const participants = useSelector(store => store.conference.participants);
    const joinRef = useRef(true);
    const handleJoin = useJoinedAndPublishedLocalClient();
    const socket = useSocket();
    const theme = useTheme();

    const handlePublish  = useCallback(async () => {
            const streams = [];
            const {joined, micro, camera} = store.getState().meeting;
            
            const audioTracks = audioStreamRef.current?.getAudioTracks() || [];
            const videoTracks = videoStreamRef.current?.getVideoTracks() || [];
            const data = {micro: {...micro}, camera: {...camera}};
            if(micro.active) {
                const [mediaStreamTrack] = audioTracks;
                const localAudioTrack = AgoraRTC.createCustomAudioTrack({ mediaStreamTrack })
                localTrackRef.current.audioTrack = localAudioTrack;
                streams.push(localAudioTrack);
                data.micro.published = true;
            }
            if(camera.active) {
                const [mediaStreamTrack] = videoTracks;
                const localVideoTrack = AgoraRTC.createCustomVideoTrack({ mediaStreamTrack })
                localTrackRef.current.videoTrack = localVideoTrack;
                streams.push(localVideoTrack);
                data.camera.published = true;
            }
            if(streams.length && joined)
                await client.publish(streams);
            return data;
    }, [client, audioStreamRef, videoStreamRef, localTrackRef]);

    const handleUserJoin = useCallback(async () => {
        if(mode === 'incoming') {
            ringRef.current?.clearAudio();
            clearTimer(timerRef.current);
            const {meetingId: id, joined} = store.getState().meeting;
            const userId = store.getState().user.id;
            const data = { startedAt: Date.now() };
            socket.emit('join', { id });
            if(joined) {
                handlePublish().then(data => {
                    store.dispatch(setData({data}));
                });
                data.mode = 'on';
            } else data.mode = 'join';
            store.dispatch(setData({data}));
            const uid = getUserUidById(userId);
            if(userId)
                store.dispatch(updateParticipantState({data: {
                        ids: [userId],
                        uid,
                        key: 'state',
                        state: {isInRoom: joined}
                }}));
        }
    },[handlePublish, mode, socket, ringRef, timerRef]);

    useLayoutEffect(() => {
        if(mode === 'incoming' && userId && joinRef.current && participants.length) {
            const {options, location: CHANEL} = store.getState().meeting;
            const uid = getUserUidById(userId);
            joinRef.current = false;
            handleJoin({...options, CHANEL, uid}, false).then(data => {
                if(store.getState().meeting.mode === 'join') {
                    handlePublish().then(data => {
                        store.dispatch(setData({data}))
                    });
                    data.mode = 'on';
                } else data.joined = true;
                store.dispatch(setData({data}));

            })
        }
    },[handleJoin, mode, userId, handlePublish, participants])

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
                >Repondre
                </Typography>
            </ThemeProvider>
        </Stack>
    )
}