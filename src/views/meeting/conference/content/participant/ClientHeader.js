import { Box as MuiBox, ThemeProvider, createTheme } from "@mui/material";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";

export default function ClientHeader ({id, audioTrack}) {
    return (
        <ThemeProvider
            theme={createTheme({palette: { mode: 'dark'}})}
        >
        <MuiBox
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            top="0"
            left="0"
            p={1}
        >{!audioTrack &&
            <MuiBox
                borderRadius={50}
                sx={{
                    background: theme => theme.palette.background.default + '90',
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: .5,
                    width: 25,
                    height: 25,
                    color: 'text.primary'
                }}
            >
                <MicOffOutlinedIcon fontSize="small"/>
            </MuiBox>}
        </MuiBox>
    </ThemeProvider>
    );
}