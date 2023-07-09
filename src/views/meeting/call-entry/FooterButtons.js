import { Toolbar } from "@mui/material";
import React, { useCallback } from "react";
import VideoCallButton from "./VideoCallButton";
import VoiceCallButton from "./VoiceCallButton";
import CancelCallButton from "./CancelCallButton";
import HangupButton from "./HangupButton";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useData } from "../../../utils/DataProvider";
import store from "../../../redux/store";
import { setCameraData, setMicroData } from "../../../redux/meeting";
import CameraButton from "./CameraButton";
import MicroButton from "./MicroButton";
import AnswerButton from "./AnswerButton";

export default function FooterOptions ({videoRef, handleCall, callState, media, setCallState}) {
    const camera = useSelector(store => store.meeting.camera);
    const dispatch = useDispatch();
    const [{videoStreamRef, audioStreamRef}] = useData();

    const getAudioStream = useCallback(() => {
        const audioDevice = store.getState().meeting.audio.input;
        navigator.mediaDevices.getUserMedia({
            audio: audioDevice.deviceId ? audioDevice : true,
        }).then(stream => {
            audioStreamRef.current = stream;
            dispatch(setMicroData({data: {active: true}}));
        }).catch(() => {});
    }, [audioStreamRef, dispatch]);
    const showButton = useCallback((...states) => states.includes(callState), [callState]);
    const getVideoStream = useCallback(() => {
        const videoDevice = store.getState().meeting.video.input;
        navigator.mediaDevices.getUserMedia({
            video: videoDevice.deviceId ? videoDevice : {
                width: videoDevice.width,
                height: videoDevice.height,
            },
        }).then(stream => {
            videoStreamRef.current = stream;
            videoRef.current.srcObject = stream;
            dispatch(setCameraData({data: {active: true}}));
        }).catch(() => {});
    }, [dispatch, videoStreamRef, videoRef]);

    useLayoutEffect(() => {
        videoRef.current.style.opacity = camera.active ? 1 : 0
    },[camera.active, videoRef]);

    useLayoutEffect(() => {
        if(callState === 'waiting' || callState === 'incoming')
            getAudioStream();
    }, [callState, getAudioStream]);

    useLayoutEffect(() => {
        if(media === 'video')
            getVideoStream();
    }, [media, getVideoStream]);
    
    return (
        <Toolbar
            variant="dense"
            disableGutters
            sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                mb: '2.5%',
                zIndex: theme => theme.zIndex.fab,
                "&  > *" : {
                    width: 70
                }
            }}
        >
            {showButton('before') &&
                <React.Fragment>
                    <VideoCallButton
                        handleCall={() => handleCall('video')}
                    />
                    <CancelCallButton/>
                    <VoiceCallButton
                        handleCall={() => handleCall()}
                    />
                </React.Fragment>
            }
            {showButton('waiting', 'outgoing', 'incoming', 'busy', 'ringing') &&
                <React.Fragment>
                    <CameraButton
                        getVideoStream={getVideoStream}
                    />
                    <MicroButton
                        getAudioStream={getAudioStream}
                    />
                    {showButton('incoming') && 
                        <AnswerButton
                            handleCall={() => handleCall('video')}
                        />
                    }
                    <HangupButton
                        setCallState={setCallState}
                    />
                </React.Fragment>
            }
        </Toolbar>
    );
}
