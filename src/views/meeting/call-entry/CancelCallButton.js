import { Fab, Box as MuiBox, Stack, createTheme } from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Typography from "../../../components/Typography";

export default function CancelCallButton () {
    return (
        <Stack
            display="flex"
            justifyContent="center"
            spacing={.5}
            alignItems="center"
        >
            <Fab
                color="default"
                size="small"
                sx={{borderRadius: 1}}
                onClick={() => window.close()}
            >
                <CloseOutlinedIcon fontSize="small" />
            </Fab>
            <Typography 
                variant="caption" 
                align="center" 
                fontSize={10.5}
            >
                Annuler
            </Typography>
        </Stack>
    )
}