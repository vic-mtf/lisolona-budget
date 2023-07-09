import React, { useLayoutEffect, useState } from "react";
import CustomSlider from "../../../../../components/CustomSlider";
import Typography from "../../../../../components/Typography";
import getFormatTime from "../../../../../utils/getFormatTime";

export default function SliderControl ({videoRef}) {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration] = useState(videoRef?.current?.duration);
    
      
    
      useLayoutEffect(() => {
        const video = videoRef.current;
        const handleTimeUpdate = event => setCurrentTime(event.target.currentTime);
        video?.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            video?.removeEventListener("timeupdate", handleTimeUpdate);
        }
      },[videoRef])


    return (
        <React.Fragment>
            <Typography noWrap textOverflow="initial">
                {getFormatTime({currentTime: duration - currentTime})}
            </Typography>
            <CustomSlider
                size="small"
                
                max={duration}
                value={currentTime}
                onChange={(event, newValue) => {
                    videoRef.current.currentTime = newValue;
                    setCurrentTime(newValue)
                }}
                step={.1}
                sx={{
                    flexGrow: 1,
                    width: 'auto',
                    transition: 'none'
                }}
            />
            <Typography noWrap textOverflow="initial">
                {getFormatTime({currentTime})}
            </Typography>
        </React.Fragment>
    )
}

