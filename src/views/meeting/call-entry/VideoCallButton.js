import { Fab, Stack, createTheme } from "@mui/material";
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import Typography from "../../../components/Typography";

export default function VideoCallButton ({handleCall}) {

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
                sx={{borderRadius: 1}}
            >
                <VideocamOutlinedIcon fontSize="small" />
            </Fab>
            <Typography
                variant="caption" 
                align="center" 
                fontSize={10.5}
                noWrap
            >
                Appel vidéo
            </Typography>
        </Stack>
    )
}