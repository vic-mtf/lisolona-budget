import { Slide, Stack } from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import LineTime from './LineTime';

export default function RecordStatusReader ({chunksRef, onResume, timeoutRef}) {
    const [paused, setPaused] = useState(true);
    const audio = useMemo(() => new Audio(), []);
    useLayoutEffect(() => {
        const onPlay = () => setPaused(false);
        const onPause = () => setPaused(true);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    },[audio]);

    return (
        <Slide in direction="left">
            <Stack
                spacing={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="row"
                height={60}
            >
                <IconButton
                    onClick={onResume}
                    color="success"
                >
                    <KeyboardVoiceOutlinedIcon/>
                </IconButton>
                <IconButton
                    onClick={() => {
                        if(audio.paused) {
                            if(audio.currentTime === audio.duration)
                                audio.currentTime = 0;
                            audio.play()
                        }
                        else audio.pause();
                        setPaused(state => ! state);
                    }}
                >
                {paused ? <PlayCircleFilledWhiteOutlinedIcon/> : <PauseCircleOutlineOutlinedIcon/>}
                </IconButton>
                <LineTime audio={audio} chunksRef={chunksRef} timeoutRef={timeoutRef}/>
            </Stack>
        </Slide>
    )
}