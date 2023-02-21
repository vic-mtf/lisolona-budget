import { createTheme, ThemeProvider, Toolbar, Tooltip } from '@mui/material';
import appConfig from '../../../../configs/app-config.json';
import AvatarStatus from './AvatarStatus';
import IconButton from '../../../../components/IconButton';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

export default function ChatHeader () {

    return (
            <Toolbar
                sx={{bgcolor: appConfig.colors.main}}
                variant="dense"
            >
                <AvatarStatus/>
                <ThemeProvider theme={createTheme({palette: {mode: 'dark'}})}>
                    <Tooltip title="Chercher" arrow>
                        <IconButton sx={{mx: 1}}>
                            <SearchOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Lancer l'appel vidéo" arrow>
                        <IconButton sx={{mx: 1}}>
                            <VideocamOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Lancer l'appel" arrow>
                        <IconButton sx={{mx: 1}}>
                            <LocalPhoneOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Plus d'options" arrow>
                        <IconButton sx={{mx: 1}}>
                            <MoreVertOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </ThemeProvider>
            </Toolbar>
    );

}