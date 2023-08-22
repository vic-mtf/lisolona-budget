import React, { useLayoutEffect, useRef, useState } from "react";
import CustomSlider from "../../../../../components/CustomSlider";
import Typography from "../../../../../components/Typography";
import getFormatTime from "../../../../../utils/getFormatTime";

export default function LineTime ({audio, chunksRef, timeoutRef}) {
    const [currentTime, setCurrentTime] = useState(timeoutRef.current);
    const [duration, setDuration] = useState(0);
    const urlRef = useRef();

    useLayoutEffect(() => {
        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration);
        };
        const onGetMetaData = () => {
            if (audio.duration === Infinity || isNaN(Number(audio.duration))) {
              audio.currentTime = 1e101;
              audio.addEventListener('timeupdate', onTimeUpdate)
            }
          }
        audio?.addEventListener('loadedmetadata', onGetMetaData);

        if(chunksRef.current.length) {
            const blobAudio = new Blob([...chunksRef.current], {type: 'audio/wav'});
            urlRef.current = URL.createObjectURL(blobAudio);
            audio.src = urlRef.current;
            audio?.load();
        }
        return () => {
            audio?.removeEventListener('timeupdate', onTimeUpdate);
            audio?.removeEventListener('loadedmetadata', onGetMetaData);
            URL.revokeObjectURL(urlRef.current);
            if(audio.src) audio.src = null;
        };
    }, [audio, chunksRef]);

    return (
        <React.Fragment>
            <CustomSlider
                sx={{width: 250}}
                min={0}
                max={duration}
                value={currentTime}
                step={.01}
                onChange={(event, value) => {
                    setCurrentTime(value);
                    audio.currentTime = value;
                }}
            />
            <Typography
                variant="body1" 
                fontWeight="bold"
                color="text.secondary"
            >
           {getFormatTime({currentTime})}
            </Typography>
        </React.Fragment>
    )
}