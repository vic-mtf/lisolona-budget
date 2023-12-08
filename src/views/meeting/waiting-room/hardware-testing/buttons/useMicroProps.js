import { useCallback, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMeetingData } from "../../../../../utils/MeetingProvider";
import { useData } from "../../../../../utils/DataProvider";
import { setMicroData } from "../../../../../redux/meeting";
import store from "../../../../../redux/store";
import AgoraRTC from "agora-rtc-sdk-ng";
import { toggleStreamActivation } from "../../../../home/checking/FooterButtons";
import getPermission from "../../../../../utils/getPermission";
import useCustomSnackbar from "../../../../../components/useCustomSnackbar";
import IconButton from "../../../../../components/IconButton";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function useMicroProps () {
    const {enqueueCustomSnackbar, closeCustomSnackbar} = useCustomSnackbar();
    const micro = useSelector(store => store.meeting.micro);
    const [permission, setPermission] = useState(null);
    // const [{localTrackRef}] = useMeetingData();
    const [{audioStreamRef}] = useData();
    
    const handleDispatchAllowed = useCallback(allowed => {
        store.dispatch(setMicroData({data: {allowed}}));
    },[]);

    const getAudioStream = useCallback(() => {
        const audioDevice = store.getState().meeting.audio.input;
        navigator?.mediaDevices?.getUserMedia({
            audio: audioDevice.deviceId ? audioDevice : true,
        }).then(async stream => {
            audioStreamRef.current = stream;
            const [mediaStreamTrack] = stream.getAudioTracks();
            // localTrackRef.current.audioTrack = AgoraRTC.createCustomAudioTrack({mediaStreamTrack});
            store.dispatch(setMicroData({data: {active: true, published: true}}));
        }).catch((e) => {
            const message = e.toString().toLowerCase();
            if('notreadableerror: could not start audio source' === message) {
                let key;
                enqueueCustomSnackbar({
                    message: `Micro occupé par une autre application.`,
                    getKey: _key => key = _key,
                    severity: 'error',
                    action: (
                        <IconButton
                            onClick={() => closeCustomSnackbar(key)}
                        >
                            <CloseOutlinedIcon/>
                        </IconButton>
                    )
                })
            }
        });
    }, [audioStreamRef, 
        //localTrackRef, 
        closeCustomSnackbar, enqueueCustomSnackbar]);

    const handleToggleMicro = useCallback(async () => {
        if(permission?.state !== 'denied') {
            const stream = audioStreamRef.current;
            if(stream && micro.allowed) {
                toggleStreamActivation(stream, 'audio');
                const state = !micro.active;
                if(!micro.published && !micro.active) {
                    const [mediaStreamTrack] = stream.getAudioTracks();
                    const audioTrack = AgoraRTC.createCustomAudioTrack({mediaStreamTrack});
                    ///localTrackRef.current.audioTrack = audioTrack;
                }
                store.dispatch(setMicroData({data: {active: state, published: state}}));
            } else getAudioStream();
        } else {
            //message audio ici
        }
    }, [audioStreamRef, micro, permission, getAudioStream, 
       // localTrackRef
    ]);


    useLayoutEffect(() => {
        if(!permission)
            getPermission('microphone')
            .then((permission) => {
                setPermission(permission);
                handleDispatchAllowed(permission.state === 'granted');
            });
        const handleChangeState = event => {
            const permission = event.target;
            setPermission(permission);
            handleDispatchAllowed(permission.state === 'granted');
        };
        permission?.addEventListener('change', handleChangeState);
        return () => {
            permission?.removeEventListener('change', handleChangeState);
        };
    }, [permission, handleDispatchAllowed]);

    return {handleToggleMicro, micro, permission, handleDispatchAllowed};
}