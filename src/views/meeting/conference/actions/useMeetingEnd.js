import { useLayoutEffect, useMemo } from "react";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import { useSocket } from "../../../../utils/SocketIOProvider";
import disconnect_src from "../../../../assets/calldisconnect.mp3";
import end_call_src from '../../../../assets/end-call.wav';
import useAudio from "../../../../utils/useAudio";
import { useData } from "../../../../utils/DataProvider";
import closeMediaStream from "../../../../utils/closeMediaStream";
import { useDispatch } from "react-redux";
import { setCameraData, setMicroData } from "../../../../redux/meeting";
import clearTimer from "../../../../utils/clearTimer";

export default function useMeetingEnd () {
    const [
        {meetingData, timerRef, participants}, 
        {setOpenEndMessageType}
    ] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);
    const origin = useMemo(() => meetingData?.origin || null, [meetingData?.origin]);
    const socket = useSocket();
    const [{ringRef}] = useMeetingData();
    const dispatch = useDispatch()
    const [{videoStreamRef, audioStreamRef, client}] = useData();
    const disconnectSong = useAudio(disconnect_src);
    const endCallSong = useAudio(end_call_src);

    useLayoutEffect(() => {
        const handleEndDirectCall = async event => {
            const isSame = event.who._id === target.id;
            if(participants.length < 2 && isSame) {
                clearTimer(timerRef.current);
                ringRef.current?.clearAudio();
                disconnectSong.audio.play();
                if(videoStreamRef.current)
                    await closeMediaStream(videoStreamRef.current);
                if(audioStreamRef.current)
                    await closeMediaStream(audioStreamRef.current);
                setOpenEndMessageType(true);
                await client.leave();
                socket.emit('hang-up',{
                    target: target.id,
                    id: origin?._id,
                    type: target.type,
                });
                dispatch(setCameraData({data: {active: false}}));
                dispatch(setMicroData({data: {active: false}}));
                setTimeout(() => {
                    if(window.opener) window.close();
                }, 2000);
            }
        }
        socket.on('hang-up', handleEndDirectCall);
        return () => {
            socket.off('hang-up', handleEndDirectCall);
        }
    }, [
        endCallSong,
        setOpenEndMessageType,
        disconnectSong,
        participants, 
        audioStreamRef, 
        videoStreamRef, 
        dispatch,
        ringRef,
        timerRef,
        target,
        origin,
        client, 
        socket,
    ]);
}