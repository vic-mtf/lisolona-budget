import { 
    Box as MuiBox, 
    Slide, 
    Stack
} from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import FrequencyAnalyzer from './FrequencyAnalyzer';
import Timer from './Timer';

export default function RecordStatusVisualizer ({time, onPause, analyserRef, timeoutRef}) {
    
    return (
        <Slide in direction="left">
            <Stack
                spacing={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="row"
                height={60}
            >
                <IconButton
                    onClick={onPause}
                >
                    <PauseCircleOutlineOutlinedIcon/>
                </IconButton>
                <FrequencyAnalyzer
                    analyserRef={analyserRef}
                />
                <Timer timeoutRef={timeoutRef}/>
            </Stack>
        </Slide>
    )
}

