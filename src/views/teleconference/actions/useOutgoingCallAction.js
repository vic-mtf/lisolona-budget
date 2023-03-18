import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference, initializeState } from "../../../redux/teleconference";
import answerRingtone from "../../../utils/answerRingtone";
import { useSocket } from "../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../utils/TeleconferenceProvider";
import useAxios from "../../../utils/useAxios";

export default function useOutgoingCallAction () {
    const socket = useSocket();
    const dispatch = useDispatch();
    const timersRef = useRef([]);
    const {token, mode, type, options, joined, modeId, mediaType} = useSelector(store => {
        const token = store.user?.token;
        const mode =  store.teleconference?.meetingMode;
        const type = store.teleconference?.type;
        const options = store.teleconference?.options;
        const joined = store.teleconference?.joined;
        const modeId = store.teleconference?.meetingId;
        const mediaType = store.teleconference?.mediaType;
        return {token, mode, type, options, joined, modeId, mediaType};
    });
    const agoraEngineRef = useRef();
    const [
        {audio, stream},
        {handleJoinChannel, handlePublishLocalTracks}
    ] = useTeleconference();
    const [,refetch, cancel] = useAxios({
            headers: {Authorization: `Bearer ${token}`}
        },{manual: true}
    );

    useEffect(() => {
        const root = document.getElementById('root');
        const name = '_call-contact';
        let getParams, ringtone, data;
        const handleOutgoingCall = event => {
            timersRef.current.forEach(timer => window.clearTimeout(timer));
            const {id, type, mediaType} = event.detail;
            const url = `/api/chat/rtc/${type}/${id}/publisher/uid`;
            ringtone = answerRingtone({
                type: 'connexion',
                audio,
            });

            const timer = window.setTimeout(() => {
                ringtone = answerRingtone({
                    type: 'end-call',
                    audio,
                });
                dispatch(addTeleconference({
                    key: 'data',
                    data: {
                        response: 'error',
                        error: 'call',
                        privileged: false,
                    }
                }));
                cancel();
            }, 10000);

            timersRef.current.push(timer);

            dispatch(
                addTeleconference({
                    key: 'data', 
                    data: {
                        meetingMode: 'outgoing',
                        privileged: true,
                        video: mediaType === 'video',
                        audio: true,
                        mediaType,
                        type,
                        videoMirrorMode: 'grid',
                        meetingId: id,
                        response: 'connexion',
                        from: id,
                    },
                })
            );
            (getParams = async () => {
                let options;
                try {
                    const {data} = await refetch({url});
                    options = {
                        appId: data.APP_ID,
                        channelToken: data.TOKEN,
                        channel: id,
                    };
                } catch(error) { getParams() }
                if(options) {
                    dispatch(addTeleconference({
                        key: 'data',
                        data: {options}
                    }));
                }
            })();
        };
        const handleCheckAvailability = ({connected}) => {
            timersRef.current.forEach(timer => window.clearTimeout(timer));
            if(connected) {
                ringtone = answerRingtone({type: 'outgoing', audio});
                data = {response: 'ringing'};
                const timer = window.setTimeout(() => {
                    ringtone = answerRingtone({type: 'end-call', audio});
                    dispatch(
                        addTeleconference({
                            key: 'data',
                            data: {
                                response: 'unanswered',
                                error: 'timeout',
                                privileged: false,
                            }
                        })
                    );
                }, 40000);
                timersRef.current.push(timer);
            } else {
                ringtone = answerRingtone({type: 'end-call', audio});
                data = {response: 'disconnected', error: 'offline'};
                timersRef.current.forEach(timer => window.clearTimeout(timer));
            }

            dispatch(
                addTeleconference(
                    {key: 'data', data}
                )
            );
            
        };
        const handleHangUpCall = ({details}) => {
            data = null;
            if(mode === 'outgoing' && type === "direct") {
                const {response} = details;
                switch(response) {
                    case 'unanswered':
                        timersRef.current.forEach(timer => window.clearTimeout(timer));
                        ringtone = answerRingtone({type: 'end-call', audio});
                        data = {error: 'timeout', response};
                        break;
                    case 'rejected':
                        timersRef.current.forEach(timer => window.clearTimeout(timer));
                        ringtone = answerRingtone({type: 'answering-machine', audio});
                        data = null;
                        ringtone.loop = false;
                        const timer = window.setTimeout(() => {
                            dispatch(initializeState({}));
                        }, 1000);
                        timersRef.current.push(timer);
                        break;
                    case 'busy':
                        data = {response};
                        ringtone = answerRingtone({type: 'busy', audio});
                        ringtone.loop = true;
                        break;
                    default: break;
                }
                if(data) dispatch(addTeleconference({data, key: 'data'}));
            }
        };
        const handlePickUpCall = ({who}) => {
            if(mode === 'outgoing') { 
                dispatch(addTeleconference({
                    key: 'data',
                    data: {
                        meetingMode: 'on',
                        videoMirrorMode: 'float',
                    }
                }));
                handlePublishLocalTracks();
            }
        };

        root.addEventListener(name, handleOutgoingCall);
        socket?.on('call-in-progress', handleCheckAvailability);
        socket?.on('hang-up', handleHangUpCall);
        socket?.on('pick-up', handlePickUpCall);
        return () => {
            root.removeEventListener(name, handleOutgoingCall);
            socket?.off('incoming-call', handleCheckAvailability);
            socket?.off('hang-up', handleHangUpCall);
            socket?.off('pick-up', handlePickUpCall);
        }
    }, [
        socket, 
        dispatch, 
        audio, 
        refetch, 
        mode, 
        cancel, 
        type,
        handlePublishLocalTracks
    ]);

    useEffect(() => {
        if(mode === 'outgoing') {
        const handleCall = (status, agoraEngine) => {
            if(status === 'success') {
                const timer = window.setTimeout(() => {
                    window.clearTimeout(timer);
                    socket?.emit('call', {
                        details: {options, mediaType, id: modeId, type},
                        target: modeId,
                        type,
                    });
                }, 1000);
                timersRef.current.push(timer);
            }
            agoraEngineRef.current = agoraEngine;
        }
        console.log(stream, options, joined, mode);
        if(stream && options && !joined) 
            handleJoinChannel(handleCall);
    }
    if(mode === 'none' && agoraEngineRef.current)
        (async() => await agoraEngineRef.current?.leave())();
    if(mode === 'on' || mode === 'none') {
        timersRef.current.forEach(timer => window.clearTimeout(timer));
        timersRef.current = [];
        audio.src = null;
    }
    } ,[
        options, 
        joined, 
        mode, 
        handleJoinChannel, 
        modeId, 
        type,
        mediaType,
        stream,
        audio
    ]);
}
