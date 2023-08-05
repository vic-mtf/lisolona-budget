import { useLayoutEffect } from "react";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import { useSocket } from "../../../../utils/SocketIOProvider";
import disconnect_src from "../../../../assets/calldisconnect.mp3";
import end_call_src from '../../../../assets/end-call.wav';
import useAudio from "../../../../utils/useAudio";
import { useData } from "../../../../utils/DataProvider";
import closeMediaStream from "../../../../utils/closeMediaStream";
import { setData } from "../../../../redux/meeting";
import clearTimer from "../../../../utils/clearTimer";
import store from "../../../../redux/store";
import useGetClients from "./useGetClients";

export default function useMeetingEnd() {
    const [{ streams }] = useData();
    const [
        { timerRef, target, origin, ringRef, localTrackRef },
        { setOpenEndMessageType }
    ] = useMeetingData();
    const socket = useSocket();
    const [{ videoStreamRef, audioStreamRef, client }] = useData();
    const participants = useGetClients();
    const disconnectSong = useAudio(disconnect_src);
    const endCallSong = useAudio(end_call_src);

    useLayoutEffect(() => {
        const handleEndDirectCall = async event => {
            const tracks = [];
            const data = {};
            const { micro, camera } = store.getState().meeting;
            const isSame = event.who._id === target.id;
            const many = participants.map(a => a?.active ? 1:0).reduce((a, p) => a + p);
            if (micro.published) {
                tracks.push(localTrackRef.current.audioTrack);
                data.micro = { active: false, published: false };
            }
            if (camera.published) {
                tracks.push(localTrackRef.current.videoTrack);
                data.camera = { active: false, published: false };
            }
            if (many < 2 && isSame) {
                clearTimer(timerRef.current);
                ringRef.current?.clearAudio();
                disconnectSong.audio.play();
                setOpenEndMessageType(true);
                if (tracks.length) await client.unpublished(tracks);
                streams.forEach(async stream => await closeMediaStream(stream.current));
                await client.leave();
                socket.emit('hang-up', {
                    target: target.id,
                    id: origin?._id,
                    type: target.type,
                });
                store.dispatch(setData({ data }));
                setTimeout(() => {
                    if (window.opener) window.close();
                }, 2000);
            }
        }
        socket.on('hang-up', handleEndDirectCall);
        return () => {
            socket.off('hang-up', handleEndDirectCall);
        }
    }, [
        participants,
        streams,
        localTrackRef,
        endCallSong,
        setOpenEndMessageType,
        disconnectSong,
        audioStreamRef,
        videoStreamRef,
        ringRef,
        timerRef,
        target,
        origin,
        client,
        socket,
    ]);
}