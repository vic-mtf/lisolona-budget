import { Box as MuiBox, Toolbar, Tooltip } from "@mui/material";
import AllowedState from "./AllowedState";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordingState from "./RecordingState";
import ListeningState from "./ListeningState";
import ToggleVoiceRecordAndTextMessageButton from "../writing-area/buttons/ToggleVoiceRecordAndTextMessageButton";
import IconButton from "../../../../../components/IconButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import store from "../../../../../redux/store";
import { modifyData } from "../../../../../redux/data";
import getPeaks from '../../../../../utils/getPeaks';

export const useWaveSurfer = (containerRef, options) => {
    const [waveSurfer, setWaveSurfer] = useState(null);

    useEffect(() => {
        let ws;
        if(containerRef.current && !waveSurfer) {
            const ws = WaveSurfer.create({
                ...options,
                container: containerRef.current,
            });
            setWaveSurfer(ws);
        }
        return () => { 
            ws?.destroy(); 
        }
    }, [options, containerRef, waveSurfer]);
    return waveSurfer
}

export const style = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'end'
};

export default function VoiceRecord({open}) {
    const [status, setStatus] = useState(null);
    const [currentState, setCurrentState] = useState('recording');
    const [mediaStream, setMediaStream] = useState(null);
    const mediaRecorderRef = useRef(null);
    const permissionRef = useRef();
    const chunksRef = useRef([]);
    const durationRef = useRef(0);
    const speaksRef = useRef([]);
    const urlRef = useRef(null);
    const rootRef = useRef();
    const handleChangeState = useCallback((state) => setCurrentState(state),[]);

    useLayoutEffect(() => {
        const  onChange = (event) => setStatus(event.target.state);
        if(window?.navigator?.permissions) {
            window.navigator.permissions?.query({
                name: 'microphone',
            }).then ( permission => {
                permissionRef.current = permission;
                setStatus(permission.state);
                permission.addEventListener('change', onChange);
            })
        } else setStatus('no-query');
        return () => {
            permissionRef?.current?.removeEventListener('change', onChange);
        };
    }, []);

    useEffect(() => {
        const mediaRecorder = mediaRecorderRef.current;
        const onDataAvailable = event => chunksRef.current.push(event.data);
        const onPause = async () => {
            const audioBlob = new Blob(chunksRef.current, {type: 'audio/webm'});
            urlRef.current = window.URL.createObjectURL(audioBlob);
            speaksRef.current = await getPeaks(
                await readAsArrayBuffer(audioBlob), 
                1000
            );
            handleChangeState('listening');
        };
        const onResume = async () => {
            window.URL.revokeObjectURL(urlRef.current);
            urlRef.current = null;
        };
        if(mediaStream && mediaRecorder) {
            mediaRecorder.addEventListener('dataavailable', onDataAvailable);
            mediaRecorder.addEventListener('pause', onPause);
            mediaRecorder.addEventListener('resume', onResume);
        }

        return () => {
            mediaRecorder?.removeEventListener('dataavailable', onDataAvailable);
            mediaRecorder?.removeEventListener('pause', onPause);
            mediaRecorder?.removeEventListener('resume', onResume);
        };
    },[mediaStream, handleChangeState]);

    return (
        <MuiBox
            height="100%"
            width="100%"
            display="flex"
            ref={rootRef}
        >
            {['prompt', 'denied'].includes(status) && 
            <AllowedState 
                state={status} 
                setStatus={setStatus}
            />}
            {['granted', 'no-query'].includes(status) && 
            <MuiBox
                height="100%"
                width="100%"
                display="flex"
                position="relative"
                px={.5}
                alignItems="end"
                justifyContent="end"
            >
                 <MuiBox>
                    <Toolbar
                        disableGutters
                        variant="dense"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                        }}
                    >
                         <Tooltip
                            arrow
                            title="Supprimer"
                        >
                        <IconButton
                            sx={{mx: .5}}
                            onClick={() => {
                                const mediaRecorder = mediaRecorderRef?.current;
                                mediaRecorder?.stop();
                                chunksRef.current = []
                                durationRef.current = 0
                                speaksRef.current = []
                                urlRef.current = null
                                mediaStream?.getTracks().forEach(track => {
                                    track.stop();
                                });
                                store.dispatch(
                                    modifyData({ data: false, key: 'chatBox.footer.recording' })
                                );
                            }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                        </Tooltip>
                        <MuiBox
                            position="relative"
                            height={40}
                            sx={{
                                minWidth: { xs: 200, sm: 250, md: 300,lg: 400,xl: 450}
                            }}
                        >
                            <RecordingState 
                                currentState={currentState}
                                show={currentState === 'recording'}
                                key={currentState === 'recording' && currentState}
                                durationRef={durationRef}
                                mediaRecorderRef={mediaRecorderRef}
                                mediaStream={mediaStream}
                                setMediaStream={setMediaStream}
                            />
                            <ListeningState 
                                onChangeState={handleChangeState}
                                show={currentState === 'listening'}
                                key={currentState === 'listening' && currentState}
                                mediaRecorderRef={mediaRecorderRef}
                                durationRef={durationRef}
                                chunksRef={chunksRef}
                                speaksRef={speaksRef}
                                urlRef={urlRef}
                            /> 
                        </MuiBox>
                        <MuiBox
                            position="relative"
                            height={40}
                            width={40}
                        >
                            <ToggleVoiceRecordAndTextMessageButton
                                onRecord={null}
                                onSend={null}
                                type="text"
                            />
                        </MuiBox>
                    </Toolbar>
                </MuiBox>
            </MuiBox>}
        </MuiBox>
    );
}


export const readAsArrayBuffer =  (blob) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', event => {
        resolve(event.target.result);
    });
    if(blob instanceof Blob)
        fileReader.readAsArrayBuffer(blob);
    else reject(new Error(blob))
})