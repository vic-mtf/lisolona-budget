// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useTeleconference } from "../../../../utils/TeleconferenceProvider";

import useHandleAudioTrack from "./useHandleAudioTrack";
import useHandleVideoTrack from "./useHandleVideoTrack";

// const CONSTRAINTS = {
//     video: {
//         //width: {ideal: window.innerWidth - 80},
//         height: {ideal: window.innerHeight},
//     }, 
//     audio: true
// };

export default function useCreateTracks () {
    const videoTackError = useHandleVideoTrack();
    const audioTackError = useHandleAudioTrack();
    
    // const [{videoTrack}, {setVideoTrack}] = useTeleconference();
    // const {mode} = useSelector(store => {
    //     const mode = store.teleconference.mode;
    //     return {mode};
    // });
    
    // const audioTrackError = useHandleAudioTrack();
    // const displayTrackError = useHandleDisplayTrackError();

    // useEffect(() => {
    //     if((mode === 'incoming' || mode === 'outgoing') && !stream) {
    //         window.navigator.mediaDevices
    //         .getUserMedia(CONSTRAINTS)
    //         .then(stream => {
    //             setStream(stream);
    //         });
    //     }
    //     if(mode === 'none' && stream) {
    //         stream.getTracks().forEach(strack => strack.stop());
    //         setStream(null);
    //     }
    // }, [stream, mode, setStream]);
}