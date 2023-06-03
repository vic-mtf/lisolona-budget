import { useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react"
import useFrequencyDataAudio from "../../../../../utils/useFrequencyDataAudio";


export default function AudioVisualizer ({analyser}) {
    const data = useFrequencyDataAudio(analyser, 40, 2000);
    const canvas = useRef();
    const theme = useTheme();
    const [canvasContext, setCanvasContext] = useState(null);

    useEffect(() => {
        setCanvasContext(canvas.current?.getContext("2d"));
    }, []);

    useEffect(() => {
        if(canvasContext) {
            canvasContext?.clearRect(0, 0, 
                canvas.current.width, 
                canvas.current.height
            );
            canvasContext.fillStyle = theme.palette.primary.main;
            data.reverse().forEach(bar => {
                canvasContext?.fillRect(...bar);
            });
        }
    }, [data, canvasContext, theme.palette.primary.main]);

    return (
        <React.Fragment>
            <canvas
                ref={canvas}
                height={30}
                width={300}
                style={{width: '20%'}}
            />
        </React.Fragment>
    )
}