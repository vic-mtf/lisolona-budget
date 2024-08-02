import { Fab, Stack, DialogActions} from "@mui/material";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import IconButton from "../../../../../components/IconButton";
import RecordStatusVisualizer from "./RecordStatusVisualizer";
import RecordStatusReader from "./RecordStatusReader";
import closeMediaStream from "../../../../../utils/closeMediaStream";
import sendVoice from "./sendVoice";

import { useFooterContext } from "../ChatFooter";

export default function RecordStatus ({stream}) {
    const analyserRef = useRef();
    const chunksRef = useRef([]);
    const timeoutRef = useRef(0);
    const mediaRecorderRef = useRef();
    const [{target}, {handleToggleRecording}] = useFooterContext();
    const [{downloadsRef}] useLocalStoreData();
    const [paused, setPaused] = useState(false);

    const handleSendVoice = () => {
        const { current: mediaRecorder } = mediaRecorderRef;
        mediaRecorder.ondataavailable = event => {
            chunksRef.current.push(event.data);
            mediaRecorder.ondataavailable = null;
            sendVoice({chunksRef, downloadsRef, target});
            handleToggleRecording();
        };
        mediaRecorder?.stop();
        closeMediaStream(stream);
    };

    const handleDeleteVoice = useCallback(() => {
        const { current: mediaRecorder } = mediaRecorderRef;
        mediaRecorder?.stop();
        closeMediaStream(stream);
        chunksRef.current= [];
        handleToggleRecording();
    }, [handleToggleRecording, stream]);

    const handleTogglePause = () => {
        const { current: mediaRecorder } = mediaRecorderRef;
        const togglePaused = !paused;
        if(togglePaused) {
            mediaRecorder.ondataavailable = event => {
                chunksRef.current.push(event.data);
                setPaused(togglePaused);
                mediaRecorder.ondataavailable = null;
            };
            mediaRecorder.pause();
            mediaRecorder.requestData();
        } else {
            mediaRecorder.resume();
            setPaused(togglePaused);
        }
    };

    useLayoutEffect(() => {
        if(stream) {
            const audioContext = new AudioContext();
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyserRef.current = analyser;
            mediaRecorder.start();
        }
    }, [stream]);

    return ( stream &&
            <DialogActions sx={{width: '100%', px: 2}}>
                <Stack
                    direction="row"
                    spacing={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <IconButton 
                        color="error"
                        onClick={handleDeleteVoice}
                    >
                        <DeleteOutlineOutlinedIcon/>
                    </IconButton>
                    {paused ?
                    (<RecordStatusReader
                        chunksRef={chunksRef}
                        onResume={handleTogglePause}
                        timeoutRef={timeoutRef}
                    />):
                    (<RecordStatusVisualizer
                        analyserRef={analyserRef}
                        onPause={handleTogglePause}
                        timeoutRef={timeoutRef}
                    />)}
                    <Fab 
                        size="small"
                        sx={{boxShadow: 0}}
                        color="primary"
                        onClick={handleSendVoice}
                    >
                        <SendOutlinedIcon fontSize="small"/>
                    </Fab>
                </Stack>
            </DialogActions>
    )
}