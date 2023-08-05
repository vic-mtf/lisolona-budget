import { 
    Slide, 
    Box as MuiBox,
    DialogContentText,
    DialogActions,
    DialogContent,
 } from "@mui/material";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import Button from '../../../../../components/Button';
import RecordStatus from "./RecordStatus";
import hasPermission from '../../../../../utils/getPermission';
import { useFooterContext } from "../ChatFooter";

export default function VoiceNoteEqualizer () {
    const [stream, setStream] = useState(null);
    const [permission, setPermission] = useState(null);
    const allowed = useMemo(() => permission?.state === 'granted', [permission?.state])
    const [{target}, {handleToggleRecording}] = useFooterContext();
    const handleAudioStream = useCallback(() => {
        const mediaDevices = navigator.mediaDevices;
        if(permission?.state !== 'denied' && mediaDevices) {
            mediaDevices.getUserMedia({audio: true})
            .then(stream => {
                setStream(stream);
            }).catch((err) => {
                console.error(`The following getUserMedia error occurred: ${err}`);
              })
        }
    },[permission?.state]);

    useLayoutEffect(() => {
        const handleChangeStreamState = (event) => {
            if(permission?.state !== 'denied') 
                handleAudioStream();
            else setPermission(event?.target);
        };
        if(permission?.state === 'granted') {
            handleAudioStream();
            permission.addEventListener('change', handleChangeStreamState);
        }
        else (async() => setPermission (await hasPermission()))();
        return () => {
            permission?.removeEventListener('change', handleChangeStreamState);
        };
    },[permission, handleAudioStream]);

    return (
        <MuiBox
            position="absolute"
            height="100%"
            width="100%"
            bottom={0}
            sx={{
                position: 'absolute',
                background: theme => `linear-gradient(transparent 0%, ${
                    theme.palette.background.paper
                } 30%)`,
                zIndex: theme => theme.zIndex.tooltip,
            }}
        >
        <Slide direction="up" in>
            <MuiBox
                height="100%"
                width="100%"
                display="flex"
                alignItems="end"
            >
                {allowed  ?
                (<RecordStatus
                    stream={stream}
                    handleToggleRecording={handleToggleRecording}
                    target={target}
                />):
                <DialogContent>
                    <DialogContentText
                        variant="body2"
                    >
                        Veuillez accorder à l'application <b>Lisolo Na Budget</b> l'autorisation 
                        d'accéder au microphone de votre appareil 
                        afin de vous permettre d'enregistrer votre note vocale {
                        permission?.state === 'denied' && '(Vérifier dans le paramètre)'
                        }.
                    </DialogContentText>
                    <DialogActions sx={{ py: 0}}>
                        <Button
                            onClick={handleToggleRecording}
                        >Annuler</Button>
                        {permission?.state === 'prompt' &&
                        <Button
                            variant="outlined"
                            onClick={handleAudioStream}
                        >Autoriser</Button>}
                    </DialogActions>
                </DialogContent>
                }
            </MuiBox>
        </Slide>
        </MuiBox>
    );
}
