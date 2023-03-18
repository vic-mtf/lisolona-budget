import { Tooltip } from '@mui/material';
import { useEffect, useMemo, useState } from "react";
import IconButton from "../../../components/IconButton";
import { useTeleconference } from '../../../utils/useTeleconferenceProvider';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';

export default function ToggleContainerSizeButton () {
    //const [turnOn, setTurnOn] = useState(true);
    const { screenSize, setScreenSize } = useTeleconference();
    const turnOn = useMemo(() => screenSize === 'large', [screenSize]);
    return (
        <Tooltip
            arrow
            title={screenSize === 'large' ? 'Reduire' : 'Agrandir'}
        >
            <IconButton
                onClick={() => setScreenSize(turnOn => turnOn === 'large' ? 'small' : 'large')}
                sx={{mx: .5}}
                size="medium"
            >
            {turnOn ? 
            (<CloseFullscreenOutlinedIcon/> ) :
            (<OpenInFullOutlinedIcon/>)
            }
            </IconButton>
        </Tooltip>
    );
}