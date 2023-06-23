import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useData } from "../../../utils/DataProvider";
import { Toolbar } from "@mui/material";
import MicroButton from "./MicroButton";
import CameraButton from "./CameraButton";
import { useDispatch } from "react-redux";
import { setCameraData, setMicroData } from "../../../redux/meeting";
import store from '../../../redux/store';

export default function FooterButtons ({videoRef}) {
    const [{audioStreamRef, videoStreamRef}] = useData();
    const dispatch = useDispatch();

    const getAudioStream = useCallback(() => {
        const audioDevice = store.getState().meeting.audio.input;
        navigator.mediaDevices.getUserMedia({
            audio: audioDevice.deviceId ? audioDevice : true,
        }).then(stream => {
            audioStreamRef.current = stream;
            dispatch(setMicroData({data: {active: true}}));
        }).catch(() => {});
    }, [audioStreamRef, dispatch]);

    const getVideoStream = useCallback(() => {
        const videoDevice = store.getState().meeting.video.input;
        navigator.mediaDevices.getUserMedia({
            video: videoDevice.deviceId ? videoDevice : true,
        }).then(stream => {
            videoStreamRef.current = stream;
            videoRef.current.srcObject = stream;
            dispatch(setCameraData({data: {active: true}}));
        }).catch(() => {});
    }, [dispatch, videoStreamRef, videoRef]);

    useEffect(() => {
        getAudioStream();
        getVideoStream();
    }, [getVideoStream, getAudioStream]);

    return (
        <Toolbar
            sx={{
                display: 'flex', 
                justifyContent: 'center', 
                width: '100%',
            }}
            variant="dense"
        >
            <MicroButton
                getAudioStream={getAudioStream}
            />
            <CameraButton
                videoRef={videoRef}
                getVideoStream={getVideoStream}
            />
        </Toolbar>
    );
}

export function toggleStreamActivation(stream, type) {
    const [videoTrack] = stream?.getVideoTracks() || [];
    const [audioTrack] = stream?.getAudioTracks() || [];
    if(audioTrack && type === 'audio') 
        audioTrack.enabled = !audioTrack.enabled;
    if(videoTrack && type === 'video')
        videoTrack.enabled = !videoTrack.enabled;
}