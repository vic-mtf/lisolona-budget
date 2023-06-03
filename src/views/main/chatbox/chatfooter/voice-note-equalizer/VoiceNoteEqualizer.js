import { 
    Slide, 
    useTheme,
    Box as MuiBox,
 } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Typography from "../../../../../components/Typography";
import RecordStatus from "./RecordStatus";
import hasPermission from '../../../../../utils/getPermission';

export default function VoiceNoteEqualizer ({handleToggleRecording}) {
    const theme = useTheme();
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef();
    const chunksRef = useRef([]);
    const analyserRef = useRef(null);
    const [microPerm, setMicroPerm] = useState(null);
    const [allowed, setAllowed] = useState(false);

    useLayoutEffect(() => {
        const mediaDevices = navigator.mediaDevices
        const allowedVoice = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
        if(microPerm?.onchange === null)
            microPerm.onchange = event => 
            setAllowed(event.target.state !== 'denied');
        if(allowedVoice && microPerm?.state !== 'denied') {
            navigator.mediaDevices.getUserMedia({audio: true})
            .then((stream) => {
                setAllowed(true);
                streamRef.current = stream;
                const contexteAudio = new window.AudioContext();
                analyserRef.current = contexteAudio.createAnalyser();
                const source = contexteAudio.createMediaStreamSource(stream);
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.start();
                source.connect(analyserRef.current);
                ///mediaRecorder.ondataavailable = event => chunksRef.current = [...chunksRef.current, event.data];
            }).catch((err) => {
              console.error(`The following getUserMedia error occurred: ${err}`);
            })
        }
    },[microPerm, allowed]);
    useLayoutEffect(() => {
        const permission = null;
        (async() => {
            permission = await hasPermission();
            console.log(permission)
         })();

        return () => {

        };
    });
    useEffect(() => {
        (async() => {
           setMicroPerm(
                await navigator.permissions.query({
                    name: "microphone"
                })
            );
        })()
    }, []);

    return ( null
        // <Slide
        //     direction="up"
        //     in
        //     style={{
        //         position: 'absolute',
        //         background: `linear-gradient(transparent 0%, ${
        //             theme.palette.background.paper
        //         } 50%)`,
        //         height: '100%',
        //         width: '100%',
        //         bottom: 0,
        //         zIndex: theme.zIndex.drawer + 1000,
        //         transitionDelay: '2ms',
        //     }}
        // >
        //     <MuiBox
        //         height="100%"
        //         width="100%"
        //         display="flex"
        //         alignItems="end"
        //     >
        //         {allowed ?
        //         <RecordStatus
        //             analyserRef={analyserRef}
        //             chunksRef={chunksRef}
        //             mediaRecorderRef={mediaRecorderRef}
        //             streamRef={streamRef}
        //             handleToggleRecording={handleToggleRecording}
        //         />: microPerm?.state?.match(/prompt|denied/) &&
        //         <Typography 
        //             align="center" 
        //             variant="body1" 
        //             paragraph 
        //             color="text.secondary"
        //             p={1}
        //         >
        //             Autorisez <b>Lisolo Na Budget</b> à accéder au microphone de votre 
        //             appareil pour vous permettre  d'enregistrer votre note vocale. 
        //             {/* ouvrir le {microPerm?.state === 'denied' &&
        //             <Link href="chrome://settings/content/microphone">paramètre</Link>} */}
        //         </Typography>
        //         }
        //     </MuiBox>
        // </Slide>
    );
}
