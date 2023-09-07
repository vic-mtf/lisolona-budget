import {
    Box as MuiBox, 
    Stack, 
    Tooltip,
    Checkbox,
    Fab,
    useTheme,
    Zoom
} from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import MicOutlinedIcon from '@mui/icons-material/MicOutlined';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import AttachFile from './AttachFile';
import { useCallback } from 'react';
import { useFooterContext } from '../ChatFooter';

export default function ToolbarFooter ({media, toggleShowToolbar}) {
    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };
    const [
        {sendable, showToolbar}, 
        {handleToggleRecording, handleSendMessage, setFiles}
    ] = useFooterContext();

    const handleSubmit = useCallback(index => [
        handleSendMessage, 
        handleToggleRecording
    ][index], [
        handleSendMessage, 
        handleToggleRecording
    ]);

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
                {media && <AttachFile
                    setFiles={setFiles}
                />}
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
                        bottom: '5px',
                    }}
                    unmountOnExit
                >
                    <Fab 
                        sx={{
                            boxShadow: 0,
                            borderRadius: 1,
                        }} 
                        aria-label={fab.label} 
                        color={fab.color}
                        title={fab.title}
                        size="small"
                        disabled={fab.disabled || (!media && fab.value(sendable, 1))}
                        onClick={handleSubmit(index)}
                    >
                        {media ? fab.icon : fabs[0].icon}
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
      title: 'Soumettre',
      id: '_send',
      value: (sendable, index) => sendable && index === 0 ,
    },
    {
      color: 'text.primary',
      icon: <MicOutlinedIcon fontSize="small"/>,
      label: 'Mic',
      title: 'Enregistrer',
      id: '_mic',
     // disabled: true,
      value: (sendable, index) => !sendable && index === 1 ,
    },
  ];