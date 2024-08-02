import { 
    Slide, 
    Box as MuiBox,
    DialogContentText,
    DialogActions,
    DialogContent,
 } from "@mui/material";
import { useCallback, useLayoutEffect, useMemo, useState, useRef } from "react";
import Button from '../../../../../components/Button';
import RecordStatus from "./RecordStatus";
import hasPermission from '../../../../../utils/getPermission';
import { useFooterContext } from "../ChatFooter";

export default function VoiceNoteEqualizer () {
    const [stream, setStream] = useState(null);
    const [permissionState, setPermissionState] = useState();
    const [{target}, {handleToggleRecording}] = useFooterContext();
    const handleAudioStream = useCallback(() => {
        const mediaDevices = navigator.mediaDevices;
        if(permissionState !== 'denied' && mediaDevices) {
            mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                setStream(stream);
            }).catch((err) => {
                console.error(`The following getUserMedia error occurred: ${err}`);
              })
        }
    },[]);

    useLayoutEffect(() => {
      
        const handleChangeStreamState = (event) => {
            if(['prompt', 'granted'].includes(permissionState)) 
                handleAudioStream();
        };
        if(permissionState === 'granted') {
            handleChangeStreamState()
    
        }
        if(!permissionState)
            (async() => { 
                    const permission = (await hasPermission());
                    setPermissionState(permission.state);
                    permission.addEventListener('change', handleChangeStreamState);
            })();
    },[handleAudioStream, permissionState]);

    return (
        <MuiBox
            position="absolute"
            height="100%"
            width="100%"
            bottom={0}
            sx={{
                position: 'absolute',
                "& > div" : {
                    background: theme => `linear-gradient(transparent 0%, ${
                        theme.palette.background.paper
                    } 100%)`,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                },
                zIndex: theme => theme.zIndex.tooltip,
            }}
        >
        <Slide direction="up" in>
            <MuiBox
                // height="100%"
                width="100%"
                display="flex"
                alignItems="end"
            >
                {stream  ?
                (
                <RecordStatus
                    stream={stream}
                    handleToggleRecording={handleToggleRecording}
                    target={target}
                />
                ):
                (
                <DialogContent>
                    <DialogContentText
                        variant="body2"
                    >
                        Veuillez accorder à l'application <b>Lisolo Na Budget</b> l'autorisation 
                        d'accéder au microphone de votre appareil 
                        afin de vous permettre d'enregistrer votre note vocale {
                        permissionState === 'denied' && '(Vérifier dans le paramètre)'
                        }.
                    </DialogContentText>
                    <DialogActions sx={{ py: 0 }}>
                        <Button onClick={handleToggleRecording}>Annuler</Button>
                        {permissionState === 'prompt' &&
                        <Button variant="outlined" onClick={handleAudioStream} >Autoriser</Button>}
                    </DialogActions>
                </DialogContent>
                )
                }
            </MuiBox>
        </Slide>
        </MuiBox>
    );
}
