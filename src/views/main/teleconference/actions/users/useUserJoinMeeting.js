import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference } from "../../../../../redux/teleconference";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";
import useJoinChannel from "../publish/useJoinChannel";
import usePublishLocalTracks from "../publish/usePublishLocalTracks";

export default function useUserJoinMeeting () {
    const dispatch = useDispatch();
    const [{timers, audio, localTracks}] = useTeleconference();
    const detailRef = useRef();
    const mode = useSelector(store => store.teleconference?.mode);
    const onJoinChannel = useJoinChannel();
    const onPublishLocalTracks = usePublishLocalTracks();
    useEffect(() => {
        const root = document.getElementById('root');
        const name = '_join-current-meeting';
        const joinMeeting = ({detail}) => {
            detailRef.current = detail;

        };
        root.addEventListener(name, joinMeeting);
        const options = detailRef.current?.options;
        if(mode === 'join' && localTracks && options)
            onJoinChannel(() => {
                dispatch(addTeleconference({
                    key: 'data',
                    data: {
                        response: null,
                        mode: 'on',
                        videoMirrorMode: 'float',
                        options,
                        error: null,
                    }
                }));
                onPublishLocalTracks();
            }, options);
        return () => {
            root.removeEventListener(name, joinMeeting);
        }
    }, [dispatch, localTracks, onJoinChannel, onPublishLocalTracks, mode]);
}
