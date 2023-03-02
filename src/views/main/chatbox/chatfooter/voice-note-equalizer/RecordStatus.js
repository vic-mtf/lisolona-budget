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
    analyseur, 
    chunks,
    mediaRecorderRef,
    handleToggleRecordin
}) {

    const handleSendVoice = () => {
        mediaRecorderRef.current?.stop();
    };

    useEffect(() => {
        if(chunks?.length) {
            window.open(
                URL.createObjectURL(
                    new Blob(chunks, { type: "audio/ogg;codecs=opus" })
                )
            );
            handleToggleRecordin();
        }
    },[chunks])

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
                analyseur={analyseur}
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