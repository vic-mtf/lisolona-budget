import { useEffect, useRef } from "react";
import {
    Box as MuiBox,
} from '@mui/material';
import FloatFrame from "./FloatFrame";
import GridFrame from "./GridFrame";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";
import { useSelector } from "react-redux";

export default function MirrorVideoFrame ({gridProps}) {
    const containerRef = useRef();
    const [{stream, localTracks}, ] = useTeleconference();
    const {mode, component} = useSelector(store => {
        const component = store.teleconference
        ?.videoMirrorMode === 'float' ?
        FloatFrame : GridFrame;
        return {component, stream, localTracks};
    });

    useEffect(() => {
        const videoTrack = localTracks?.videoTrack;
        const container = containerRef.current;
        let video = container?.querySelector('video');
        video?.remove();
        if(videoTrack && stream && containerRef.current) {
            videoTrack.play(container);
            let video = container?.querySelector('video');
            video.style.transform = 'scale(-1,1)';
            video.parentNode.style.backgroundColor = 'transparent';
        }  
    });

    return mode !== 'none' && (
        <MuiBox
            component={component}
            gridProps={gridProps}
        >
            <MuiBox
                height="100%"
                width="100%"
                ref={containerRef}
                bgcolor="transparent"
                sx={{position: 'relative'}}
                className="test"
            />
        </MuiBox>
    );
}