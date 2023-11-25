import { Box as MuiBox, Stack, useTheme, Fade, Tooltip } from "@mui/material";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import RecordPlugin from 'wavesurfer.js/dist/plugins/record';
import { readAsArrayBuffer, style, useWaveSurfer } from "./VoiceRecord";
import IconButton from "../../../../../components/IconButton";
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import Typography from "../../../../../components/Typography";
import formatTime from "../../../../../utils/formatTime";
import mergeAudioBlobs from '../../../../../utils/mergeAudioBlobs';
import concatAudio from "../../../../../utils/concatAudio";
// import RecordPlugin from "./recordPlugin";

export default function RecordingState({
    show, 
    setMediaStream,
    mediaStream,
    mediaRecorderRef,
    durationRef, 
}) {
    const containerRecordRef = useRef()
    const theme = useTheme();
    const waveSurferRecord = useWaveSurfer(containerRecordRef, {
        waveColor: theme.palette.primary.main,
        progressColor: theme.palette.primary.main,
        height: 40,
        barGap: 2,
        barHeight: .9,
        barRadius: 10,
        barWidth: 4,
    });
    const record = useMemo(() => waveSurferRecord ? (waveSurferRecord.plugins?.length === 0 ?
        waveSurferRecord?.registerPlugin(RecordPlugin.create({mimeType: "audio/webm"})):
        waveSurferRecord?.plugins[0]) : null
        , 
        [waveSurferRecord]
    );

    const handleListenCurrentVoice = () => {
        const mediaRecorder = mediaRecorderRef.current;
        mediaRecorder?.requestData();
        mediaRecorder?.pause();
    };
    
    useLayoutEffect(() => {
        const mediaRecorder = mediaRecorderRef.current;
        if(record && !mediaStream) 
            window.navigator.mediaDevices
            .getUserMedia({ audio: true}).then(stream => {
                    record.renderMicStream(stream);
                    setMediaStream(stream);
                    const mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
                    mediaRecorderRef.current = mediaRecorder;
                    mediaRecorder.start();
                });
        const handleDestroy = () => waveSurferRecord?.destroy();
        const onResume = () => record.renderMicStream(mediaStream);
        mediaRecorder?.addEventListener('stop',handleDestroy);
        mediaRecorder?.addEventListener('resume', onResume);
        return () => {
            mediaRecorder?.removeEventListener('stop', handleDestroy);
            mediaRecorder?.removeEventListener('resume', onResume);
        };
    },[mediaStream, setMediaStream, record, waveSurferRecord, mediaRecorderRef]);

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
                    width={10}
                >
                    <MuiBox
                        flexGrow={1}
                        ref={containerRecordRef}
                        display="block"
                        position="relative"
                        component="div"
                        mx={1}
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
                    >
                    </MuiBox>
                    <Timer
                        durationRef={durationRef}
                        running={Boolean(show)}
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
                        title="Pause"
                    >
                    
                        <IconButton
                            sx={{ mx: .5}}
                            onClick={handleListenCurrentVoice}
                            color="error"
                        >
                            <PauseCircleOutlineIcon
                                fontSize="small"
                            />
                        </IconButton>
                    </Tooltip>
                </MuiBox>
            </MuiBox>
        </Fade>
    );
}


function Timer ({durationRef, running}) {
    const [time, setTime] = useState(durationRef.current);

    useEffect(() => {
        const timer = running ? window.setInterval(() => {
                setTime(time => { 
                    durationRef.current = time + .01;
                    return  durationRef.current;
                });
        }, 10) : null;

        return () => {
            window.clearInterval(timer);
        }
    },[running, durationRef])

    return (
        <Typography 
            align="center"
            justifyContent="center"
            alignItems="center"
            display="flex"
            height="100%"
            mx={.5}
        >{formatTime({currentTime: time}).trim()}
        </Typography>
    )
}