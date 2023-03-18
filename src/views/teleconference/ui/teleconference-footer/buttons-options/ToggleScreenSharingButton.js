import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import StopScreenShareOutlinedIcon from '@mui/icons-material/StopScreenShareOutlined';
import IconButton from '../../../../../components/IconButton';
import { useCallback, useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { BottomNavigationAction, Tab, Tooltip } from '@mui/material';
import Typography from '../../../../../components/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useTeleconference } from '../../../../../utils/TeleconferenceProvider';
import { addTeleconference } from '../../../../../redux/teleconference';

export default function ToggleScreenSharingButton () {
    const turnOn = useSelector(store => store.teleconference.screenSharing);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [{localTracks, tracksRef, displayStream, agoraEngine}, {setDisplayStream}] = useTeleconference();


    const handleToggleScreenSharing = useCallback(async () => {
        const videoTrack = localTracks?.videoTrack;
        const screenTrack = tracksRef.current?.screenTrack;
        let data = turnOn;
        setLoading(true);
        if(!turnOn) {
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia();
                setDisplayStream(displayStream);
                const [screenTrackStream] = displayStream.getVideoTracks();
                const screenTrack = AgoraRTC.createCustomVideoTrack({
                    mediaStreamTrack: screenTrackStream,
                });
                videoTrack.stop();
                await agoraEngine.unpublish(videoTrack);
                await agoraEngine.publish(screenTrack);
                data = true;
                tracksRef.current = {
                    screenTrack
                };
            } catch (error) {console.log(error)}
        } else {
                screenTrack.stop();
                await agoraEngine.unpublish(screenTrack);
                await agoraEngine.publish(videoTrack);
                data = false;
                displayStream.getTracks().forEach(strack => strack.stop());
                setDisplayStream(null);
        }
        setLoading(false);
        dispatch(addTeleconference({
            key: 'screenSharing',
            data,
        }))
    }, [displayStream, setLoading, loading, setDisplayStream, tracksRef, turnOn]);

    useEffect(() => {
        if(displayStream)
            displayStream.onremovetrack = handleToggleScreenSharing;
    }, [handleToggleScreenSharing]);

    return (
        <Tooltip
            title={turnOn ? "Arreter le parge d'écran" : "Partager votre écran"}
            arrow
        >
             <div>
                <BottomNavigationAction
                    icon={turnOn ?
                    <StopScreenShareOutlinedIcon fontSize="small"/> :
                    <ScreenShareOutlinedIcon fontSize="small"/>
                    } 
                    disabled={loading}
                    label={
                        <Typography 
                            variant="caption" 
                            fontSize="10px" 
                            color="inherit"
                        >
                            Partage écran
                        </Typography>
                    }
                    showLabel
                    selected={turnOn}
                    onClick={handleToggleScreenSharing}
                    sx={{
                        borderRadius: 1,
                        color: 'inherit'
                    }}
                />
            </div>
        </Tooltip>
    )
}