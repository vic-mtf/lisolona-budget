import { useLayoutEffect, useRef } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import useAudio from "../../../../utils/useAudio";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import ringing_src from '../../../../assets/ring-ton-outgoing-call.wav';
import end_call_src from '../../../../assets/end-call.wav';
import reject_src from '../../../../assets/answering-machine.wav';
import { useDispatch, useSelector } from "react-redux";
import store from "../../../../redux/store";
import { useMemo } from "react";
import { useData } from "../../../../utils/DataProvider";
import { setCameraData } from "../../../../redux/meeting";
import song_src from '../../../../assets/Halloween-Cradles.mp3';
import clearTimer from "../../../../utils/clearTimer";

export default function useRinging(callState, setCallState) {
    const socket = useSocket();
    const [{client}] = useData();
    const ringingRef = useRef(false);

    const ringingAudio = useAudio(ringing_src);
    const endCallAudio = useAudio(end_call_src);
    const rejectAudio = useAudio(reject_src);
    const songAudio  = useAudio(song_src);

    const mode = useSelector(store => store.meeting.mode);
    const location = useSelector(store => store.meeting.location);
    const [{ringRef, timerRef, meetingData}] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);
    const origin = useMemo(() => meetingData?.origin || null, [meetingData?.origin]);

    const dispatch = useDispatch();

    useLayoutEffect(() => {

        const handleUnAnswer = async (e) => {
            clearTimer(timerRef.current);
            ringRef.current?.clearAudio();
            setCallState('unanswer');
            endCallAudio.audio.play();
            await client.leave();
            dispatch(setCameraData({data: {active: false}}));
            setTimeout(() => {
                if(window.opener) window.close();
            }, 1000);
        };

        const handleRejectOutgoing = async (e) => {
            clearTimer(timerRef.current);
            ringRef.current?.clearAudio();
            setCallState('reject');
            rejectAudio.audio.play();
            await client.leave();
            dispatch(setCameraData({data: {active: false}}));
            setTimeout(() => {
                if(window.opener) window.close();
            }, 1000);
        };
        const handleRingingOutgoing = event => {
            clearTimer(timerRef.current);
            if(store.getState().meeting.mode === 'outgoing') 
                timerRef.current = window.setTimeout(handleUnAnswer, 1200);
            if(callState !== 'ringing') {
                setCallState('ringing');
                ringRef.current?.clearAudio();
                ringingAudio.audio.play();
                ringingAudio.audio.loop = true;
                ringRef.current = ringingAudio;
            }
        };

        if(mode === 'outgoing') {
            clearTimer(timerRef.current);
            socket.on('ringing', handleRingingOutgoing);
            socket.on('hang-up', handleRejectOutgoing);
        }

        if(callState === 'incoming' && mode === "incoming" && !ringingRef.current) {
            ringingRef.current = true;
            ringRef.current?.clearAudio();
            clearTimer(timerRef.current);
            ringRef.current = songAudio;
            songAudio.audio.autoplay = true;
            songAudio.audio.loop = true;
            songAudio.audio.load();
            let counter = 0;
            timerRef.current = setInterval(() => {
                counter += 1;
                if(store.getState().meeting.mode === 'incoming') 
                    socket.emit('ringing', {
                        id: origin?._id,
                        type: target?.type,
                        target: target?.id,
                    });
                if(counter === 60) {
                    handleUnAnswer();
                    clearTimer(timerRef.current);
                }
            }, 500);
            socket.on('hang-up', handleUnAnswer);
        }

        return () => {
            socket.off('ringing', handleRingingOutgoing);
            socket.off('hang-up', handleRejectOutgoing);
            socket.off('hang-up', handleUnAnswer);
        };

    }, [
        socket, 
        callState, 
        setCallState, 
        ringingAudio, 
        ringRef, 
        endCallAudio, 
        rejectAudio,
        songAudio,
        mode,
        target,
        origin,
        location,
        dispatch,
        timerRef,
        client
    ]);

}