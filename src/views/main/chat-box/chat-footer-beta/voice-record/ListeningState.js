import { Box as MuiBox, Stack, useTheme, Fade, Slider, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { style, useWaveSurfer } from "./VoiceRecord";
import IconButton from "../../../../../components/IconButton";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import Typography from "../../../../../components/Typography";
import formatTime from '../../../../../utils/formatTime';

export default function ListeningState({
    speaksRef, 
    show, 
    urlRef, 
    onChangeState, 
    durationRef, 
    mediaRecorderRef
}) {
    const containerListeningRef = useRef();
    const theme = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const waveSurferListening = useWaveSurfer(containerListeningRef, {
        waveColor: theme.palette.text.disabled,
        progressColor: theme.palette.primary.main,
        height: 30,
        barGap: 2,
        barHeight: .9,
        cursorWidth: 0,
        barRadius: 4,
        barWidth: 4,
        speaks: speaksRef?.current,
        url: urlRef?.current,
    });
    
    useEffect(() => {
        const unsubscribeFinish = waveSurferListening?.on('finish', () => {
            setIsPlaying(false);
        });
        return () => {
            if(typeof unsubscribeFinish === 'function') unsubscribeFinish()
        };
    },[waveSurferListening]);

    return (
        <Fade in={Boolean(show)} style={style}>
            <MuiBox
                 display="flex"
                 justifyContent="center"
                 alignItems="center"
                 flexDirection="row"
                 width="100%"
            >
                <Stack
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="row"
                    flexGrow={1}
                    height="100%"
                >
                    <MuiBox
                        display="block"
                    >
                        <Tooltip
                            arrow
                            title={isPlaying ? "Pause" : "Lire"}
                        >
                            <IconButton
                                sx={{mx: .5}}
                                onClick={() => {
                                    if(isPlaying) {
                                        waveSurferListening.pause();
                                        setIsPlaying(false);
                                    } else {
                                        waveSurferListening.play();
                                        setIsPlaying(true);
                                    }
                                }}
                            >
                                {isPlaying ? 
                                (<PauseOutlinedIcon fontSize="small"/>) : 
                                (<PlayArrowOutlinedIcon fontSize="small"/>)}
                            </IconButton>
                        </Tooltip>
                    </MuiBox>
                    <ContainerSlider
                        flexGrow={1}
                        containerRef={containerListeningRef}
                        waveSurfer={waveSurferListening}
                        durationRef={durationRef}
                        display="block"
                        position="relative"
                        component="div"
                        mx={1}
                        bgcolor="orangered"
                        sx={{
                            height: '100%',
                            "& div": {
                                position: "absolute",
                                width: '100%',
                                margin: 'auto',
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }
                        }}
                    />
                </Stack>
                <MuiBox
                    height="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Tooltip
                        arrow
                        title="Enregistrer"
                    >
                        <IconButton
                            sx={{ mx: .5}}
                            onClick={() => {
                                const mediaRecorder =  mediaRecorderRef?.current;
                                mediaRecorder?.resume();
                                if(typeof onChangeState === 'function') {
                                    onChangeState('recording');
                                }
                            }}
                        >
                            <KeyboardVoiceOutlinedIcon
                                fontSize="small"
                            />
                        </IconButton>
                    </Tooltip>
                </MuiBox>
            </MuiBox>
        </Fade>
    );
}


const ContainerSlider = ({waveSurfer, containerRef, durationRef}) => {
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(durationRef.current);

    useEffect(() => {
        const unsubscribeProgress = waveSurfer?.on('timeupdate', progress => {
                setPosition(progress);
        });
        const unsubscribeReady = waveSurfer?.on('ready', duration => {
            setDuration(duration);
            durationRef.current = duration;
        });
        return () => {
            if(typeof unsubscribeProgress === 'function')
                unsubscribeProgress();
            if(typeof unsubscribeReady === 'function')
                unsubscribeReady();
        }
    }, [waveSurfer, durationRef]);

    return (
        <>
            <Typography
                align="center"
                justifyContent="center"
                alignItems="center"
                display="flex"
                mx={.5}
            >{formatTime({currentTime: duration - position})}</Typography>
            <MuiBox
                flexGrow={1}
                ref={containerRef}
                display="block"
                position="relative"
                component="div"
                mx={1}
                sx={{
                    height: 50,
                    "& div": {
                        height: 30,
                        position: "absolute",
                        top: 0,
                        width: '100%',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        margin: 'auto',
                    }
                }}
            >
                <MuiBox
                    position="absolute"
                    sx={{
                        zIndex: theme => theme.zIndex.appBar,
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        left: '50%',
                        top: '50%',
                    }}
                >
                    <Slider
                        aria-label="time-indicator"
                        size="small"
                        value={position}
                        min={0}
                        step={.00001}
                        max={duration}
                        onChange={(_, value) => {
                            setPosition(value);
                            waveSurfer?.setTime(value);
                        }}
                    sx={{
                            color: 'transparent',
                        zIndex: theme => theme.zIndex.appBar,
                        height: 4,
                            '& .MuiSlider-thumb': {
                            width: 8,
                            height: 8,
                            color: theme => theme.palette.primary.main,
                            boxShadow: 1,
                            transition: 'none',
                            '&:before': {
                                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                            },
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: theme => `0px 0px 0px 8px ${
                                theme.palette.mode === 'dark'
                                    ? 'rgb(255 255 255 / 16%)'
                                    : 'rgb(0 0 0 / 16%)'
                                }`,
                            },
                            '&.Mui-active': {
                                width: 20,
                                height: 20,
                            },
                            },
                            '& .MuiSlider-rail': {
                            opacity: 0.28,
                            color: 'transparent',
                            },
                            '& .MuiSlider-mark': {
                                color: 'transparent',
                            }
                    }}
                    />
                </MuiBox>
            </MuiBox>
     </>
    );
};