import { Box as MuiBox, ListItemText, ListItemIcon } from "@mui/material";
import CustomSlider from "../../../../../../components/CustomSlider";
import React, { useLayoutEffect, useRef, useState } from "react";
import IconButton from "../../../../../../components/IconButton";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import formatTime from "../../../../../../utils/formatTime";
import { useData } from "../../../../../../utils/DataProvider";

export default function VoiceControls ({voiceData}) {
    const [playing, setPlaying] = useState(voiceData?.audio?.paused === false);
    
    useLayoutEffect(() => {
        const root = document.getElementById('root');
        const name = '_auto-stop-play';
        const audio = voiceData?.audio;
        const onPlay = () => {
            const customEvent = new CustomEvent(name, {
                detail: {...voiceData}
            });
            root.dispatchEvent(customEvent);
        }
        const onEnd = () => {
            if(playing) setPlaying(false);
        };
        const onAutoStopPlay = event => {
            const { id } = event.detail;
            if(id !== voiceData?.id && playing) {
                audio.pause();
                setPlaying(false);
            }
        };
        audio.addEventListener('play', onPlay);

        audio.addEventListener('ended', onEnd);
        root.addEventListener(name, onAutoStopPlay);
        return () => {
            audio?.removeEventListener('play', onPlay);
            audio?.removeEventListener('ended', onEnd);
            root?.removeEventListener(name, onAutoStopPlay);
        }
    }, [voiceData, playing]);

    return (
        <React.Fragment>
            <AudioSlider
                voiceData={voiceData}
            />
            <ListItemIcon
                spacing={1}
                direction="row"
            >
                <IconButton
                    onClick={() => {
                        const audio = voiceData?.audio;
                        if(audio.paused) audio?.play()
                        else audio?.pause();
                        setPlaying(state => !state);
                    }}
                >
                    {playing ? <PauseOutlinedIcon/> : <PlayArrowOutlinedIcon/>}
                </IconButton>
            </ListItemIcon>
        </React.Fragment>
    );
}

const AudioSlider = ({voiceData}) => {
    const [currentTime, setCurrentTime] = useState(voiceData?.currentTime);
    const [duration, setDuration] = useState(voiceData?.duration);
    const firstStateRef = useRef(voiceData?.duration === 0);
    const [{voicesRef}] = useData();

    useLayoutEffect(() => {
        const audio = voiceData?.audio;
        const onTimeUpdate = event => {
            const {currentTime, duration} = event.target;
            if(firstStateRef.current) {
                setCurrentTime(0);
                audio.currentTime = 0;
                setDuration(duration);
                firstStateRef.current = false;
            } else setCurrentTime(currentTime);
            const index = voicesRef?.current?.findIndex(({id}) => voiceData?.id === id);
            const newVoiceData = {
                ...voiceData,
                currentTime,
                duration,
                audio: event.target,
            };
            if(index > -1) {
                voicesRef.current[index] = newVoiceData;
            } else voicesRef?.current.push(newVoiceData);
        };
        const onGetMetaData = () => {
            if (audio.duration === Infinity || isNaN(Number(audio.duration))) {
              audio.currentTime = 1e101;
              audio.addEventListener('timeupdate', onTimeUpdate)
            } else setDuration(audio.duration);
          }
        audio?.addEventListener('loadedmetadata', onGetMetaData);
        if(!firstStateRef.current) audio.addEventListener('timeupdate', onTimeUpdate);
        return () => {
            audio?.removeEventListener('loadedmetadata', onGetMetaData);
            audio?.removeEventListener('timeupdate', onTimeUpdate);
        };
    },[voiceData, voicesRef]);

    return (
        <ListItemText
            sx={{position: 'relative',}}
            primary={
                <MuiBox 
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CustomSlider
                        value={currentTime}
                        onChange={(event, value) => { 
                            setCurrentTime(value);
                            const audio = voiceData?.audio;
                            if(audio) audio.currentTime = value;
                        }}
                        max={duration}
                        step={.01}
                    />
                </MuiBox>
            }
            secondary={formatTime({currentTime: currentTime || duration})}
            primaryTypographyProps={{
                variant: 'body2',
                fontWeight: 'bold',
                component: 'div',
                noWrap: true,
                overflow: 'visible',
                
            }}
            secondaryTypographyProps={{
                variant: 'caption',
                textOverflow: 'ellipsis',
                noWrap: true,
                position: 'absolute',
               // bottom: 0
            }}
        />
    );
}