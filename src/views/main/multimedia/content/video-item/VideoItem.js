import { Box as MuiBox, Stack, Toolbar } from '@mui/material';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ImageZoom from "react-image-zooom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import CustomSlider from '../../../../../components/CustomSlider';
import IconButton from '../../../../../components/IconButton';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ControlsBar from './ControlsBar';

export default function VideoItem ({src, coverUrl, selected, title, description, containerInnerRootRef, index}) {
    const [showControlesBar, setShowControlesBar] = useState(false);
    const isFirstStartRef = useRef(true);
    const videoRef = useRef();

    const handleTransitionEnd = useCallback(event => {
        if(event.propertyName === 'transform') {
            const {current:video} = videoRef;
            if(selected) {
                if(!showControlesBar)
                    setShowControlesBar(true);
            } else {
                if(showControlesBar)
                    setShowControlesBar(false);
                isFirstStartRef.current = false;
                if(video.paused) video.currentTime = 0;
            }
        }
    }, [selected, showControlesBar]);

    const handleLoadedData = useCallback(() => {
        const {current:isFirstStart} = isFirstStartRef;
        if(isFirstStart && selected) 
            handleTransitionEnd({
                propertyName: 'transform'
            });
        isFirstStartRef.current = false;
    },[selected, handleTransitionEnd]);

    useLayoutEffect(() => {
        const {current:video} = videoRef;
        const containerInnerRoot = containerInnerRootRef.current;
        containerInnerRoot?.addEventListener(
            'transitionend', 
            handleTransitionEnd
        );
        if(!video.paused && !selected) video.pause();
        return () => {
            containerInnerRoot?.removeEventListener(
                'transitionend', 
                handleTransitionEnd
            );
        }
    }, [selected, handleTransitionEnd, containerInnerRootRef]);

    return (
        <MuiBox
            display="flex"
            height="100%"
            width="100%"
            justifyContent="center"
            alignItems="center"
            position="relative"
            overflow="hidden"
        >
            <video
                src={src}
                ref={videoRef}
                preload="metadata"
                onLoadedData={handleLoadedData}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                }}
            />
            {(showControlesBar) && 
            <ControlsBar
                videoRef={videoRef}
            />}
        </MuiBox>
    );
}
