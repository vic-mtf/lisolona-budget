import { 
    Box as MuiBox, 
    Fab, 
    Stack } 
from "@mui/material";
import Timer from "./Timer";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AudioVisualizer from "./AudioVisualizer";
import { useEffect } from "react";

export default function RecordStatus ({
    analyser, 
    chunks,
    mediaRecorderRef,
    handleToggleRecording,
    streamRef,
}) {

    const handleSendVoice = () => {
        const stream = streamRef?.current;
        mediaRecorderRef.current?.stop();
        stream.getTracks().forEach(track => track.stop());
        const file = new Blob(chunks, { type: "audio/ogg;codecs=opus" });
        const audio = new Audio();
        audio.autoplay = true;
       // audio.src = URL.createObjectURL(file);
       console.log(file, stream);
        window.open(URL.createObjectURL(file));
        handleToggleRecording();
    };

    return (
        <Stack
            height={80}
            width="100%"
            display="flex"
            alignItems="center"
            direction="row"
            justifyContent="center"
            spacing={2}
            p={2}
        >
            <MuiBox flexGrow={1}/>
            <MuiBox></MuiBox>
            <MuiBox>
                <Timer/>
            </MuiBox>
            <AudioVisualizer
                analyser={analyser}
            />
            <MuiBox>
                <Fab 
                    size="small"
                    sx={{boxShadow: 0}}
                    color="primary"
                    onClick={handleSendVoice}
                >
                    <SendOutlinedIcon fontSize="small"/>
                </Fab>
            </MuiBox>
        </Stack>
    )
}