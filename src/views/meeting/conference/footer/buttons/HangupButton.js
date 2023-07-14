import { Fab, ThemeProvider, createTheme, useTheme } from "@mui/material";
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';
import useAudio from  "../../../../../utils/useAudio";
import disconnect_src from "../../../../../assets/calldisconnect.mp3";
import { useData } from  "../../../../../utils/DataProvider";
import closeMediaStream from  "../../../../../utils/closeMediaStream";
import { useMeetingData } from  "../../../../../utils/MeetingProvider";
import { setCameraData, setMicroData } from "../../../../../redux/meeting";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import clearTimer from "../../../../../utils/clearTimer";

export default function HangupButton () {
    const theme = useTheme();
    const disconnectAudio = useAudio(disconnect_src);
    const [{videoStreamRef, audioStreamRef, client}] = useData();
    const id = useSelector(store => store.meeting.id);
    const [
        {meetingData, timerRef}, 
        {setOpenEndMessageType}
    ] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);
    const origin = useMemo(() => meetingData?.origin || null, [meetingData?.origin]);
    const socket = useSocket();
    const [{ringRef}] = useMeetingData();
    const dispatch = useDispatch()

    return (
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
                    setOpenEndMessageType(true);
                    await client.leave();
                    disconnectAudio.audio.play();
                    dispatch(setCameraData({data: {active: false}}));
                    dispatch(setMicroData({data: {active: false}}));
                    setTimeout(() => {
                        if(window.opener) window.close();
                    }, 2000);
                    
                }}
                sx={{
                    borderRadius: 1,
                    boxShadow: 0,
                }}
            >
                <CallEndOutlinedIcon fontSize="small" />
            </Fab>
        </ThemeProvider>
    );
}