import { Fab, Stack, ThemeProvider, createTheme, useTheme } from "@mui/material";
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';
import useAudio from "../../../utils/useAudio";
import disconnect_src from "../../../assets/calldisconnect.mp3";
import { useData } from "../../../utils/DataProvider";
import closeMediaStream from "../../../utils/closeMediaStream";
import { useMeetingData } from "../../../utils/MeetingProvider";
import { setCameraData } from "../../../redux/meeting";
import { useDispatch, useSelector } from "react-redux";
import Typography from "../../../components/Typography";
import { useSocket } from "../../../utils/SocketIOProvider";
import { useMemo } from "react";
import clearTimer from "../../../utils/clearTimer";

export default function HangupButton ({setCallState}) {
    const theme = useTheme();
    const disconnectAudio = useAudio(disconnect_src);
    const [{videoStreamRef, audioStreamRef, client}] = useData();
    const id = useSelector(store => store.meeting.id);
    const [{meetingData, timerRef}] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);
    const origin = useMemo(() => meetingData?.origin || null, [meetingData?.origin]);

    const socket = useSocket();
    const [{ringRef}] = useMeetingData();
    const dispatch = useDispatch()

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
                            main: '#f50057',
                            dark: '#ab003c',
                            light: '#f73378'
                        }
                    }
                })}
            >
                <Fab
                    size="small"
                    color="primary"
                    onClick={async () => {
                        clearTimer(timerRef.current);
                        disconnectAudio.audio.play();
                        ringRef.current?.clearAudio();
                        socket.emit('hang-up',{
                            target: target.id,
                            id: origin?._id || id,
                            type: target.type,
                        });
                        if(videoStreamRef.current)
                            await closeMediaStream(videoStreamRef.current);
                        if(audioStreamRef.current)
                            await closeMediaStream(audioStreamRef.current);
                        await client.leave();
                        dispatch(setCameraData({data: {active: false}}));
                        setCallState('hangup');
                        setTimeout(() => {
                            if(window.opener) window.close();
                        }, 1000);
                    }}
                    sx={{
                        borderRadius: 1,
                        mx: 1,
                    }}
                >
                    <CallEndOutlinedIcon fontSize="small" />
                </Fab>
                <Typography
                    variant="caption" 
                    align="center" 
                    fontSize={10.5}
                    noWrap
                >
                    Racrocher
                </Typography>
            </ThemeProvider>
        </Stack>
    )
}