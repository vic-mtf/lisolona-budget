import { createTheme, ThemeProvider, Toolbar, Tooltip, Paper } from '@mui/material';
import appConfig from '../../../../configs/app-config.json';
import AvatarStatus from './AvatarStatus';
import IconButton from '../../../../components/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MoreOption from './more-options/MoreOption';
import { useTheme } from '@emotion/react';
//import CallButtons from './options-buttons/CallButtons';
import CallButton from './options-buttons/CallButton';

export default function ChatHeader ({target}) {
    const theme = useTheme();
    return (
        <Paper
            sx={{
                borderRadius: 0,
            }}
        >
            <Toolbar
                variant="dense"
            >
                <AvatarStatus target={target}/>
                <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
                    <Tooltip title="Chercher" arrow>
                        <div>
                            <IconButton 
                                sx={{mx: 1}}
                                disabled
                            >
                                <SearchOutlinedIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Tooltip>
                    <CallButton 
                        target={target}
                        theme={theme}
                    />
                    <MoreOption
                        theme={theme}
                        target={target}
                    />
                </ThemeProvider>
            </Toolbar>
        </Paper>
    );
}