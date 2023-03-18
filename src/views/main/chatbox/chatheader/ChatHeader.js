import { createTheme, ThemeProvider, Toolbar, Tooltip } from '@mui/material';
import appConfig from '../../../../configs/app-config.json';
import AvatarStatus from './AvatarStatus';
import IconButton from '../../../../components/IconButton';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import MoreOption from './moreoptions/MoreOption';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';

export default function ChatHeader ({chatId}) {
    const theme = useTheme();
    const {type, disabled} = useSelector(store => {
        const disabled = store.teleconference?.meetingMode !== 'none';
        const type = store.data.contacts.find(({id}) => id === chatId) ? 
        'direct' : 'room';
        return {disabled, type}
    });

    const handleCallContact = mediaType => () => {
        const root = document.getElementById('root');
        const name = '_call-contact';
        const detail = {
            id: chatId,
            mediaType,
            name,
            type,
        };
        const customEvent = new CustomEvent(name,{detail})
        root.dispatchEvent(customEvent);
    };

    return (
            <Toolbar
                sx={{bgcolor: appConfig.colors.main}}
                variant="dense"
            >
                <AvatarStatus/>
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
                    <Tooltip 
                        title={disabled ? "Un appel en cours..." : "Lancer l'appel vidéo" }
                        arrow
                    >
                        <div>
                            <IconButton 
                                sx={{mx: 1}} 
                                disabled={disabled}
                                onClick={handleCallContact('video')}
                            >
                                <VideocamOutlinedIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Tooltip title={disabled ? "Un appel en cours..." : "Lancer l'appel"} 
                        arrow
                    >
                        <div>
                            <IconButton 
                                sx={{mx: 1}} 
                                disabled={disabled}
                                onClick={handleCallContact('audio')}
                            >
                                <LocalPhoneOutlinedIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Tooltip>
                    <MoreOption
                        theme={theme}
                    />
                </ThemeProvider>
            </Toolbar>
    );

}