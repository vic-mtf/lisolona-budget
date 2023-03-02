import {
    Box as MuiBox, 
    Stack, 
    Tooltip,
    Checkbox,
    Fab,
    useTheme,
    Zoom
} from '@mui/material';
import IconButton from '../../../../components/IconButton';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import MicOutlinedIcon from '@mui/icons-material/MicOutlined';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import AttachFile from './AttachFile';
import { getDraftText } from './ChatFooter';
import { EditorState } from 'draft-js';
import { useSelector } from 'react-redux';
import { useSocket } from '../../../../utils/SocketIOProvider';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';

export default function ToolbarFooter ({
    sendable,
    showToolbar,
    toggleShowToolbar,
    editorState,
    handleChange,
    handleToggleRecording,
    handleSendMessage
}) {
    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };
    const hanldeSubmit = index => [
        handleSendMessage, 
        handleToggleRecording
    ][index];

    return (
        <MuiBox
            sx={{
                display: 'flex', 
                flexWrap: 'wrap', 
                p: .5, 
                position: 'relative'
            }}
        >
            <Stack
                direction="row"
                flexGrow={1}
                display="flex"
                alignItems="center"
                spacing={.5}
            >
                <Tooltip title="La section d'expressions" arrow>
                    <div>
                        <IconButton disabled>
                            <SentimentSatisfiedAltOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title="barre d'outils" arrow>
                    <div>
                        <Checkbox
                            size="small"  
                            checked={showToolbar}
                            onChange={toggleShowToolbar}
                            icon={<ViewStreamOutlinedIcon fontSize="small"/>}
                            checkedIcon={<ViewStreamIcon fontSize="small"/>}
                        />
                    </div>
                </Tooltip>
                <AttachFile/>
            </Stack>
            {fabs.map((fab, index) => (
                <Zoom
                    key={fab.id}
                    in={fab.value(sendable, index)}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${
                            fab.value(sendable, index) ? transitionDuration.exit : 0
                        }ms`,
                        position: 'absolute',
                        right: '5px',
                    }}
                    unmountOnExit
                >
                    <Fab 
                        sx={{
                            m: 0, 
                            p: 0, 
                            boxShadow: 0,
                        }} 
                        aria-label={fab.label} 
                        color={fab.color}
                        title={fab.title}
                        size="small"
                        disabled={fab.disabled}
                        onClick={hanldeSubmit(index)}
                    >
                        {fab.icon}
                    </Fab>
                </Zoom>
            ))}
    
        </MuiBox>
    );
} 

const fabs = [
    {
      color: 'primary',
      icon: <SendOutlinedIcon fontSize="small"/>,
      label: 'Send',
      title: 'Soumettre le message',
      id: '_send',
      value: (sendable, index) => sendable && index === 0 ,
    },
    {
      color: 'inherit',
      icon: <MicOutlinedIcon fontSize="small"/>,
      label: 'Mic',
      title: 'Enregistrer un message',
      id: '_mic',
      //disabled: true,
      value: (sendable, index) => !sendable && index === 1 ,
    },
  ];