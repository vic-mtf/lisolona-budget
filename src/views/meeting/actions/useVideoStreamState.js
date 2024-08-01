import { useLayoutEffect } from "react";

import store from "../../../redux/store";

export default function useVideoStreamState (videoRef) {
    const [{videoStreamRef}] useLocalStoreData();
    useLayoutEffect(() => {
        let defaultState;
        let display;
        const unsubscribe = store.subscribe(() => {
            const state = store.getState().meeting.camera.active;
            const video = videoRef.current;
            if(video && defaultState !== state && videoStreamRef.current) {
                if(!display) display = window.getComputedStyle(video, null).display;
                video.style.opacity = state ? 1 : 0;
                defaultState = state;
                video.srcObject = state ? videoStreamRef.current : null;
                video.style.display = state ? display : "none";
            }
        });
        return () => {
            unsubscribe();
        };
    },[videoRef, videoStreamRef]);
}