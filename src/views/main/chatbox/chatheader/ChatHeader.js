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
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../../redux/teleconference';

export default function ChatHeader ({chatId}) {
    const theme = useTheme();
    const isCalling = useSelector(store => store.teleconference.isCalling);
    const dispatch = useDispatch();

    const handleCallClient = type => () => {
        dispatch(addTeleconference({
            key: 'data',
            data: {
                type,
                isCalling: true,
                clientId: chatId,
                variant: 'outgoing',
            }
        }))
    };

    return (
            <Toolbar
                sx={{bgcolor: appConfig.colors.main}}
                variant="dense"
            >
                <AvatarStatus/>
                <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
                    <Tooltip title="Chercher" arrow>
                        <IconButton 
                            sx={{mx: 1}}
                        >
                            <SearchOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip 
                        title={isCalling ? "Un appel en cours..." : "Lancer l'appel vidéo" }
                        arrow
                    >
                        <div>
                            <IconButton 
                                sx={{mx: 1}} 
                                disabled={isCalling}
                                onClick={handleCallClient('video')}
                            >
                                <VideocamOutlinedIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Tooltip title={isCalling ? "Un appel en cours..." : "Lancer l'appel"} 
                        arrow
                    >
                        <div>
                            <IconButton 
                                sx={{mx: 1}} 
                                disabled={isCalling}
                                onClick={handleCallClient('audio')}
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