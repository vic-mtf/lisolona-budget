import { Box as MuiBox, Paper, Slide, Stack } from '@mui/material';
import CustomSlider from '../../../../../components/CustomSlider';
import IconButton from '../../../../../components/IconButton';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import VolumeButtonSlider from './VolumeButtonSlider';
import PlayPauseButton from './PlayPauseButton';
import SliderControl from './SliderControl';
import ToggleScreenButton from './ToggleScreenButton';

const MAX_DELAI_TIMER = 3000; 

export default function ControlsBar ({videoRef}) {
    const [show, setShow] = useState(true); 
    const rootRef = useRef();
    const timerRef = useRef();
    const handleAutoHideControlsBar = useCallback(() => {
        const {current: video} = videoRef;
        window.clearTimeout(timerRef.current);
        if(video.paused && !show)
            setShow(true);
        if(!video.paused) {
            if(!show) setShow(true);
            timerRef.current = window.setTimeout(() => setShow(false), MAX_DELAI_TIMER);
        }
    }, [videoRef, show]);

    useLayoutEffect(() => {
        const {current: video} = videoRef;
        video.addEventListener('play', handleAutoHideControlsBar);
        video.addEventListener('pause', handleAutoHideControlsBar);
        video.addEventListener('click', handleAutoHideControlsBar);
        video.addEventListener('mousemove', handleAutoHideControlsBar);
        return () => {
            video.removeEventListener('play', handleAutoHideControlsBar);
            video.removeEventListener('pause', handleAutoHideControlsBar);
            video.removeEventListener('click', handleAutoHideControlsBar);
            video.removeEventListener('mousemove', handleAutoHideControlsBar);
        };
    }, [videoRef, handleAutoHideControlsBar]);

    return (
        <MuiBox
            sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pb: '3%',
                mx: '10%'
            }}
            onMouseEnter={() => {
                handleAutoHideControlsBar();
                window.clearTimeout(timerRef.current);
            }}
            onMouseLeave={handleAutoHideControlsBar}
        >
            <Slide in={show} direction="up">
                <Stack
                    direction="row"
                    spacing={1}
                    elevation={5}
                    component={Paper}
                    flexGrow={1}
                    borderRadius={2}
                    height={40}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    px={2}
                    ref={rootRef}
                    sx={{
                        backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                        background: theme => theme.palette.background.paper + 
                        theme.customOptions.opacity,
                    }}
                >
                    <PlayPauseButton
                        videoRef={videoRef}
                    />
                    <SliderControl
                        videoRef={videoRef}
                    />
                    <ToggleScreenButton
                        videoRef={videoRef}
                    />
                    <VolumeButtonSlider
                        anchorElRef={rootRef}
                        videoRef={videoRef}
                    />
                </Stack>
            </Slide>
        </MuiBox>
    );
}