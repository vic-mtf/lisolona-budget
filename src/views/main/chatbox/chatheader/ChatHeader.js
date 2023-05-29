import { createTheme, ThemeProvider, Toolbar, Tooltip } from '@mui/material';
import appConfig from '../../../../configs/app-config.json';
import AvatarStatus from './AvatarStatus';
import IconButton from '../../../../components/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MoreOption from './moreoptions/MoreOption';
import { useTheme } from '@emotion/react';
import CallButtons from './options-buttons/CallButtons';

export default function ChatHeader ({target}) {
    const theme = useTheme();
    return (
            <Toolbar
                sx={{bgcolor: appConfig.colors.main}}
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
                    <CallButtons target={target}/>
                    <MoreOption
                        theme={theme}
                        target={target}
                    />
                </ThemeProvider>
            </Toolbar>
    );
}