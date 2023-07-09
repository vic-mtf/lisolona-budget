import { Fab, Stack, ThemeProvider, createTheme, useTheme } from "@mui/material";
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';
import useAudio from  "../../../../../utils/useAudio";
import disconnect_src from "../../../../../assets/calldisconnect.mp3";
import { useData } from  "../../../../../utils/DataProvider";
import closeMediaStream from  "../../../../../utils/closeMediaStream";
import { useMeetingData } from  "../../../../../utils/MeetingProvider";
import { setCameraData } from "../../../../../redux/meeting";
import { useDispatch } from "react-redux";

export default function HangupButton ({setCallState}) {
    const theme = useTheme();
    const disconnectAudio = useAudio(disconnect_src);
    // const [{videoStreamRef, audioStreamRef, client}] = useData();
    // const [{ringRef}] = useMeetingData();
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
                // onClick={async () => {
                //     disconnectAudio.audio.play();
                //     ringRef.current?.clearAudio();
                //     if(videoStreamRef.current)
                //         await closeMediaStream(videoStreamRef.current);
                //     if(audioStreamRef.current)
                //         await closeMediaStream(audioStreamRef.current);
                //     await client.leave();
                //     dispatch(setCameraData({data: {active: false}}));
                //     setCallState('hangup');
                //     setTimeout(() => {
                //         if(window.opener) window.close();
                //     }, 1000);
                // }}
                sx={{
                    borderRadius: 1,
                    boxShadow: 0,
                    boxShadow: 'none',
                }}
            >
                <CallEndOutlinedIcon fontSize="small" />
            </Fab>
        </ThemeProvider>
    );
}