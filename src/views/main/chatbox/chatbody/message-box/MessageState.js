import {
    Box as MuiBox,
} from '@mui/material';
import { createTheme } from "@mui/material"
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined';

export default function MessageState ({sended, read}) {
    const theme = createTheme({palette: {mode: 'light'}});
    
    return (
        <MuiBox
            position="absolute"
            bottom={-2}
            right={3}
            color={theme.palette.text.secondary}
        >
            {sended ? 
            <DoneOutlinedIcon sx={{fontSize:12}} /> :
            <HistoryToggleOffOutlinedIcon sx={{fontSize:15}} />}
        </MuiBox>
    )
}