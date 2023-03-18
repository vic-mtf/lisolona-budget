import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTeleconference } from "../../../utils/TeleconferenceProvider";

const CONSTRAINTS = {
    video: {
        //width: {ideal: window.innerWidth - 80},
        height: {ideal: window.innerHeight},
    }, 
    audio: true
};

export default function useCreateStream () {
    const [{stream}, {setStream}] = useTeleconference();
    const {mode} = useSelector(store => {
        const mode = store.teleconference.meetingMode;
        return {mode};
    });

    useEffect(() => {
        if((mode === 'incoming' || mode === 'outgoing') && !stream) {
            window.navigator.mediaDevices
            .getUserMedia(CONSTRAINTS)
            .then(stream => {
                setStream(stream);
            });
        }
        if(mode === 'none' && stream) {
            stream.getTracks().forEach(strack => strack.stop());
            setStream(null);
        }
    }, [stream, mode, setStream]);
}