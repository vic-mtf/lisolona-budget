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
import busy_src from '../../../../assets/busyphone.mp3';

export default function useRinging(callState, setCallState) {
    const socket = useSocket();
    const [{client}] = useData();

    const ringingTimerOutgoing = useRef();

    const ringingAudio = useAudio(ringing_src);
    const endCallAudio = useAudio(end_call_src);
    const rejectAudio = useAudio(reject_src);
    const busyAudio =  useAudio(busy_src);
    const mode = useSelector(store => store.meeting.mode);
    const [{ringRef, meetingData}] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);
    const origin = useMemo(() => meetingData?.origin || null, [meetingData?.origin]);

    const dispatch = useDispatch();

    useLayoutEffect(() => {

        const handleUnAnswer = async () => {
            window.clearTimeout(ringingTimerOutgoing.current);
            ringRef.current?.clearAudio();
            setCallState('unanswer');
            endCallAudio.audio.play();
            await client.leave();
            dispatch(setCameraData({data: {active: false}}));
            setTimeout(() => {
                if(window.opener) window.close();
            }, 1000);
        };

        const handleRingingBusy = event => {
            window.clearTimeout(ringingTimerOutgoing.current);
            ringingTimerOutgoing.current = window.setTimeout(handleUnAnswer, 1500);
            if(callState !== 'busy') {
                setCallState('busy');
                ringRef.current?.clearAudio();
                busyAudio.audio.play();
                busyAudio.audio.loop = true;
                ringRef.current = ringingAudio;
            }
        };

        if(mode === 'outgoing') {
            socket.on('busy', handleRingingBusy);
        }

        return () => {
            socket.off('busy', handleRingingBusy);
            socket.off('ringing', handleRingingBusy);
        };

    }, [
        socket, 
        callState, 
        setCallState, 
        ringingAudio, 
        ringRef, 
        endCallAudio, 
        rejectAudio,
        busyAudio,
        mode,
        target,
        origin,
        dispatch,
        client
    ]);

}