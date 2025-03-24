
import { Box as MuiBox, Slide, Stack, Toolbar } from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';


export default function PlayPauseButton ({videoRef}) {
    const [playing, setPlaying] = useState(false);
    const handlePlayOrPauseVideo = useCallback(() => setPlaying(play => !play), []);

    useLayoutEffect(() => {
        const {current: video} = videoRef;
        if(playing) video.play();
        else video.pause();
        const handelVideoEnd = () => setPlaying(false);
        video.addEventListener('ended', handelVideoEnd);
        video.addEventListener('click', handlePlayOrPauseVideo);
        return () => { 
            video.removeEventListener('ended', handelVideoEnd);
            video.removeEventListener('click', handlePlayOrPauseVideo);
        }
    },[playing, handlePlayOrPauseVideo]);

    return (
        <IconButton
            onClick={handlePlayOrPauseVideo}
        >
            {playing ?
            <PauseRoundedIcon/>:
            <PlayArrowRoundedIcon/>}
        </IconButton>
    )
}