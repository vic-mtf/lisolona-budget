import { useLayoutEffect, useMemo, useRef } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import useAudio from "../../../../utils/useAudio";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import ringing_src from '../../../../assets/ring-ton-outgoing-call.wav';
import end_call_src from '../../../../assets/end-call.wav';
import reject_src from '../../../../assets/answering-machine.wav';
import { useSelector } from "react-redux";
import store from "../../../../redux/store";
import { useData } from "../../../../utils/DataProvider";
import { setData } from "../../../../redux/meeting";
import song_src from '../../../../assets/Halloween-Cradles.mp3';
import clearTimer from "../../../../utils/clearTimer";

export default function useRinging(callState, setCallState) {
    const socket = useSocket();
    const [{client}] = useData();
    const ringingRef = useRef(false);

    const ringingAudio = useAudio(ringing_src);
    const endCallAudio = useAudio(end_call_src);
    const rejectAudio = useAudio(reject_src);
    const songAudio  = useMemo(() => window.openerSongAudio, []);

    const mode = useSelector(store => store.meeting.mode);
    const location = useSelector(store => store.meeting.location);
    const [{ringRef, timerRef, target, origin}] = useMeetingData();

    useLayoutEffect(() => {
        const deviceData = {
            camera: { active: false },
            micro: { active: false }
        };
        const handleWindowBeforeClose = () => {
            const data =  {
                id: origin?._id,
                type: 'direct',
                target: target?.id,
                data: {state: 'unanswered'},
            };
            if(mode === 'incoming' && callState === 'incoming')
                socket.emit('ringing', data);
            if(mode === 'outgoing') {
                delete data.data;
                socket.emit('hang-up', data);
            }   
        };

        const handleUnanswered = async (event) => {
            const joined = store.getState().meeting.joined;
            clearTimer(timerRef.current);
            ringRef.current?.clearAudio();
            setCallState('unanswered');
            endCallAudio.audio.play();
            if(joined) await client.leave();
            store.dispatch(setData({
                data: deviceData,
            }));
            setTimeout(() => {
                if(window.opener) window.close();
            }, 1000);
        };

        const handleRejectOutgoing = async () => {
            const joined = store.getState().meeting.joined;
            clearTimer(timerRef.current);
            ringRef.current?.clearAudio();
            setCallState('reject');
            rejectAudio.audio.play();
            if(joined) await client.leave();
            store.dispatch(setData({
                data: deviceData,
            }));
            setTimeout(() => {
                if(window.opener) window.close();
            }, 1000);
        };

        const handleRingingOutgoing = event => {
            const clientState = event?.data?.state; 
            const id = event.who._id;
            clearTimer(timerRef.current);
            console.log('handleRingingOutgoing:', callState, event?.data);
            if(target.id === id) {
                if(clientState === 'unanswered') handleUnanswered();
                if(callState !== 'ringing' && clientState === 'ringing') {
                    setCallState('ringing');
                    ringRef.current?.clearAudio();
                    ringingAudio.audio.play();
                    ringingAudio.audio.loop = true;
                    ringRef.current = ringingAudio;
                    if(store.getState().meeting.mode === 'outgoing')
                        timerRef.current = window.setTimeout(handleUnanswered, 60000);
                }
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
            const data =  {
                id: origin?._id,
                type: target?.type,
                target: target?.id,
                data: {state: 'ringing'}
            };
            socket.emit('ringing', data);
            timerRef.current = setInterval(() => {
                counter += 1;
                if(store.getState().meeting.mode === 'incoming') 
                    socket.emit('ringing', data);
                if(counter === 6) {
                    handleUnanswered();
                    clearTimer(timerRef.current);
                    data.data.state = 'unanswered';
                    socket.emit('ringing', data);
                }
            }, 5000);
            socket.on('hang-up', handleUnanswered);
        }
        window.addEventListener('beforeunload', handleWindowBeforeClose);
        return () => {
            socket.off('ringing', handleRingingOutgoing);
            socket.off('hang-up', handleRejectOutgoing);
            socket.off('hang-up', handleUnanswered);
            window.removeEventListener('beforeunload', handleWindowBeforeClose);
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
        timerRef,
        client
    ]);

}