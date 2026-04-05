import React from "react"
import Typography from "../../../components/Typography"
import CameraButtonWithoutLabel from "../../home/checking/CameraButton"
import { Stack } from "@mui/material"

const CameraButton = ({label, getVideoStream }) => {
    return (
        <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            spacing={.5}
        >
            <CameraButtonWithoutLabel
                getVideoStream={getVideoStream}
            />
            <Typography
                variant="caption" 
                align="center" 
                fontSize={10.5}
                noWrap
            >
                {label || 'Webcam'}
            </Typography>
        </Stack>
    )
}


export default CameraButton;