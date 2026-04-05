import { Fab, Stack, createTheme } from "@mui/material";
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import Typography from "../../../components/Typography";

export default function VoiceCallButton ({handleCall}) {
    
    return (
        <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            spacing={.5}
            
        >
            <Fab
                color="primary"
                size="small"
                onClick={handleCall}
                sx={{borderRadius: 1,}}
            >
                <CallOutlinedIcon fontSize="small" />
            </Fab>
            <Typography
                variant="caption" 
                align="center" 
                fontSize={10.5}
                noWrap
            >
                Appeler
            </Typography>
        </Stack>
    );
}