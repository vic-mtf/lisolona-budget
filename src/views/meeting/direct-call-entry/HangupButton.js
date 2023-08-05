import { Fab, Stack, ThemeProvider, createTheme, useTheme } from "@mui/material";
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';
import useAudio from "../../../utils/useAudio";
import disconnect_src from "../../../assets/calldisconnect.mp3";
import { useData } from "../../../utils/DataProvider";
import closeMediaStream from "../../../utils/closeMediaStream";
import { useMeetingData } from "../../../utils/MeetingProvider";
import { setCameraData } from "../../../redux/meeting";
import { useDispatch } from "react-redux";
import Typography from "../../../components/Typography";
import { useSocket } from "../../../utils/SocketIOProvider";
import clearTimer from "../../../utils/clearTimer";
import store from "../../../redux/store";

export default function HangupButton ({setCallState}) {
    const theme = useTheme();
    const disconnectAudio = useAudio(disconnect_src);
    const [{streams, client}] = useData();
    const [{timerRef, target, origin, ringRef}] = useMeetingData();
    const socket = useSocket();
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
                        const id = origin?._id || store.getState().meeting.meetingId;
                        socket.emit('hang-up', {
                            target: target.id,
                            id,
                            type: 'direct',
                        });
                        streams.forEach(async stream => await closeMediaStream(stream.current));
                        if(store.getState().meeting.joined)
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