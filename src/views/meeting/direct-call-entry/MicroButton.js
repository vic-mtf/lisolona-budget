import React from "react"
import Typography from "../../../components/Typography"
import MicroButtonWithoutLabel from "../../home/checking/MicroButton"
import { Stack } from "@mui/material"

const MicroButton = ({label, getAudioStream}) => {
    return (
        <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            spacing={.5}
            
        >
            <MicroButtonWithoutLabel
                getAudioStream={getAudioStream}
            />
            <Typography
                variant="caption" 
                align="center" 
                fontSize={10.5}
                noWrap
            >
                {label || 'Micro'}
            </Typography>
        </Stack>
    );
}

export default MicroButton;