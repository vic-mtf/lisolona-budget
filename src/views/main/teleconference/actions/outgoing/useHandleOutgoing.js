import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference } from "../../../../../redux/teleconference";
import answerRingtone from "../../../../../utils/answerRingtone";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";
import useAxios from "../../../../../utils/useAxios";

export default function useHandleOutgoing () {
    const dispatch = useDispatch();
    const token = useSelector(store => store.user?.token);
    const mode = useSelector(store => store.teleconference?.mode);
    const [{audio, timers}] = useTeleconference();
    const [,refetch, cancel] = useAxios({
            headers: {Authorization: `Bearer ${token}`},
            timeout: 2000,
        },{manual: true}
    );

    useEffect(() => {
        const root = document.getElementById('root');
        const name = '_call-contact';
        let ringtone;
        const handleOutgoingCall = event => {
            timers.forEach(timer => window.clearTimeout(timer));
            const {target, mediaType} = event.detail;
            const url = `/api/chat/rtc/${target?.type}/${target?.id}/publisher/uid`;
            ringtone = answerRingtone({type: 'connexion', audio});
            dispatch(
                addTeleconference({
                    key: 'data', 
                    data: {
                        mode: 'outgoing',
                        video: mediaType === 'video',
                        audio: true,
                        mediaType,
                        videoMirrorMode: 'grid',
                        response: 'connexion',
                        target,
                        screen: 'full',
                    },
                })
            );
            (async () => {
                let options;
                try {
                    const {data} = await refetch({url});
                    options = {
                        appId: data.APP_ID,
                        channelToken: data.TOKEN,
                        channel: target.id,
                    };
                } catch(error) {
                    options = null;
                    timers.forEach(timer => window.clearTimeout(timer));
                }
                if(options) {
                    const data = {key: 'options', data: options};
                    dispatch(addTeleconference(data));
                } else {
                    timers.forEach(timer => window.clearTimeout(timer));
                    ringtone = answerRingtone({type: 'end-call', audio});
                    dispatch(addTeleconference({
                        key: 'data',
                        data: {
                            response: 'error',
                            error: 'call',
                            mode: 'none',
                        }
                    }));
                };
            })();
        };
       root.addEventListener(name, handleOutgoingCall);
        return () => {
            root.removeEventListener(name, handleOutgoingCall);
        }
    }, [dispatch, audio, refetch, cancel, timers, mode]);

}