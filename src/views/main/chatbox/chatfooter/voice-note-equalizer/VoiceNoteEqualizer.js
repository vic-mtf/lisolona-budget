import { 
    Slide, 
    useTheme,
    Box as MuiBox,
 } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Typography from "../../../../../components/Typography";
import RecordStatus from "./RecordStatus";

export default function VoiceNoteEqualizer ({handleToggleRecordin}) {
    const theme = useTheme();
    const audioRef = useRef(null);
    const mediaRecorderRef = useRef();
    const [analyseur, setAnalyseur] = useState();
    const [microPerm, setMicroPerm] = useState(null);
    const [allowed, setAllowed] = useState(false);
    const [chunks, setChunks] = useState([]);

    useEffect(() => {
        if(microPerm?.onchange === null)
            microPerm.onchange = event => 
            setAllowed(event.target.state !== 'denied');
        if(
            navigator.mediaDevices && 
            navigator.mediaDevices.getUserMedia &&
            microPerm?.state !== 'denied' 
        ) {
            navigator.mediaDevices.getUserMedia({audio: true,}
            ).then((stream) => {
                setAllowed(true);
                audioRef.current = stream;
                const contexteAudio = new window.AudioContext();
                const analyseur = contexteAudio.createAnalyser();
                const source = contexteAudio.createMediaStreamSource(stream);
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder
                mediaRecorder.ondataavailable = event => setChunks(
                    chucks => [...chucks, event.data]
                );
                source.connect(analyseur);
                setAnalyseur(analyseur);
                mediaRecorder.start();
            })
    
            .catch((err) => {
              console.error(`The following getUserMedia error occurred: ${err}`);
            })
        }
    },[microPerm, allowed]);

    useEffect(() => {
        (async() => {
           setMicroPerm(
                await navigator.permissions.query({
                    name: "microphone"
                })
            );
        })()
    }, []);

    return (
        <Slide
            direction="up"
            in
            style={{
                position: 'absolute',
                background: `linear-gradient(transparent 0%, ${
                    theme.palette.background.paper
                } 50%)`,
                height: '100%',
                width: '100%',
                bottom: 0,
                zIndex: theme.zIndex.drawer + 1000,
                transitionDelay: '2ms',
            }}
        >
            <MuiBox
                height="100%"
                width="100%"
                display="flex"
                alignItems="end"
                // onClick={() => mediaRecorderRef.current?.start()}
            >
                {allowed ?
                <RecordStatus
                    analyseur={analyseur}
                    chunks={chunks}
                    mediaRecorderRef={mediaRecorderRef}
                    handleToggleRecordin={handleToggleRecordin}
                />: microPerm?.state?.match(/prompt|denied/) &&
                <Typography 
                    align="center" 
                    variant="body1" 
                    paragraph 
                    color="text.secondary"
                    p={1}
                >
                    Autorisez <b>Lisolo Na Budget</b> à accéder au microphone de votre 
                    appareil pour vous permettre  d'enregistrer votre note vocale. 
                    {/* ouvrir le {microPerm?.state === 'denied' &&
                    <Link href="chrome://settings/content/microphone">paramètre</Link>} */}
                </Typography>
                }
            </MuiBox>
        </Slide>
    );
}
