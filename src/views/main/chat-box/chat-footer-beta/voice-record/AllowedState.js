import { Box as MuiBox, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import Button from "../../../../../components/Button";
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';

export default function AllowedState ({state, setStatus}) {
    return (
        <MuiBox
            display="flex"
            flexDirection="column"
            maxWidth="100%"
            sx={{
                px: {
                    md:10,
                    lg: 20,
                    xs: 0
                }
            }}
        >
          <DialogContent
            sx={{
                display: 'row'
            }}
          >
            <DialogContentText
                component="div"
                display="flex"
                flexDirection="row"
                gap={1}
                variant="body2"
            >
                <MuiBox
                    borderRadius={25}
                    bgcolor="primary.main"
                    color="white"
                    display="inline-flex"
                    p={1}
                    width={40}
                    height={40}
                >
                    <KeyboardVoiceOutlinedIcon/>
                </MuiBox>
               {state === "prompt" ? 
               `Autorisation requise pour l'utilisation de 
                votre microphone afin de débuter l'enregistrement.`:
                `Pour enregistrer, veuillez autoriser l'accès 
                au micro de votre appareil depuis les paramètres de votre navigateur`
                }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={null}
              color="primary"
              
            >
              Annuler
            </Button>
            {state === "prompt" &&
            <Button
              onClick={() => {
                window?.navigator?.mediaDevices?.getUserMedia({audio: true})
                .then(stream => {
                  setStatus('granted');
                  stream.getAudioTracks().forEach(track => {
                    track.stop();
                  });
                })
                .catch(() => {
                  setStatus('denied');
                })
                
              }}
              color="primary"
              variant="outlined"
            >
                D'accord
            </Button>}
          </DialogActions>
        </MuiBox>
    )
}