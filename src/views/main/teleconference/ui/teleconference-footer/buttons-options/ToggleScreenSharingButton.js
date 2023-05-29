import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import StopScreenShareOutlinedIcon from '@mui/icons-material/StopScreenShareOutlined';
import { useCallback, useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { BottomNavigationAction, Tooltip, Zoom } from '@mui/material';
import Typography from '../../../../../../components/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useTeleconference } from '../../../../../../utils/TeleconferenceProvider';
import { addTeleconference } from '../../../../../../redux/teleconference';

export default function ToggleScreenSharingButton () {
    const mode = useSelector(store => store.teleconference.mode);
    const turnOn = useSelector(store => store.teleconference.screenSharing);
    const [loading, setLoading] = useState(false);
    const [stream, setStream] = useState(null)
    const dispatch = useDispatch();
    const [{localTracks, agoraEngine}, {setScreenVideoTrack}] = useTeleconference();

    const handleToggleScreenSharing = useCallback(async (state) => {
        if(agoraEngine) {
            const {videoTrack, screenVideoTrack} = localTracks || {}
            let params;
            setLoading(true);
            const screenSharing = typeof state === 'boolean' ? state : turnOn;
            if(screenSharing) {
                screenVideoTrack?.stop();
                await agoraEngine?.unpublish(screenVideoTrack);
                if(videoTrack?.enable)
                    await agoraEngine?.publish(videoTrack);
                setScreenVideoTrack(null);
                screenVideoTrack?.close();
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
                params = {key: 'screenSharing', data: false};
            } else {
                try {
                    const screenVideoTrack = await AgoraRTC.createScreenVideoTrack();
                    const mediaStream = new MediaStream([screenVideoTrack.getMediaStreamTrack()]);
                    setStream(mediaStream);
                    setScreenVideoTrack(screenVideoTrack);
                    videoTrack?.stop();
                    if(videoTrack)
                        await agoraEngine.unpublish(videoTrack);
                    await agoraEngine.publish(screenVideoTrack);
                    params = {key: 'screenSharing', data: true};
                } catch (error) {
                   // console.log(error)
                };
            }
            setLoading(false);
            if(params) dispatch(addTeleconference(params));
        }
    }, [setLoading, setScreenVideoTrack, turnOn, localTracks, dispatch, agoraEngine, stream]);

    useEffect(() => {
        if(stream && turnOn)
            stream.oninactive = handleToggleScreenSharing;
        if(mode === 'none') handleToggleScreenSharing(true);
    }, [stream, handleToggleScreenSharing, turnOn, mode]);
    
    return (
        <Zoom in={mode === 'on'}>
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
        </Zoom>
    );
}