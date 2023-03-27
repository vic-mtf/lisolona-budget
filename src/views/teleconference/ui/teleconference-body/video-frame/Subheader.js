import { ThemeProvider } from '@emotion/react'
import { 
    Chip, 
    createTheme,
    Box as MuiBox,
 } from '@mui/material';
import Typography from '../../../../../components/Typography';
import useGetUser from './useGetUser';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import IconButton from '../../../../../components/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../../../redux/teleconference';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import { useMemo } from 'react';

export default function Subheader ({uid, micTurnOn}) {
    const { name } = useGetUser(uid);
    const {priorityTargetId} = useSelector(store => {
        const priorityTargetId = store.teleconference.priorityTargetId;
        return {priorityTargetId}
    });
    const dispatch = useDispatch();

    const isFullScreen = useMemo(() => Boolean(priorityTargetId), [priorityTargetId]);

    return (
        <MuiBox
            sx={{
                position: 'absolute',
                left: '5px',
                bottom: '5px',
                zIndex: theme => theme.zIndex.drawer,
            }}
        >
            <ThemeProvider theme={createTheme({palette: {mode : 'light'}})}>
                <Chip
                    label={
                        <ThemeProvider theme={createTheme({palette: {mode : 'dark'}})}>
                            <Typography >{name}</Typography>
                        </ThemeProvider>
                    }
                    size="small"
                    avatar={
                        <Typography>
                            {micTurnOn ?  
                            <MicIcon color="success"  fontSize="small" /> : 
                            <MicOffIcon color="error" fontSize="small" />}
                        </Typography>
                    }
                    deleteIcon={
                        <ThemeProvider theme={createTheme({palette: {mode : 'dark'}})}>
                            <IconButton
                                onClick={() => {
                                    
                                    dispatch(addTeleconference({
                                        key: 'data',
                                        data: {
                                            videoMirrorMode: 'float',
                                            priorityTargetId: isFullScreen ? null: uid,
                                        }
                                    }))
                                }}
                            >{
                                isFullScreen ? 
                                <FullscreenExitOutlinedIcon fontSize="small"/> :
                                <FullscreenOutlinedIcon fontSize="small"/>
                            }
                            </IconButton>
                        </ThemeProvider>
                    }
                    onDelete={() => null}

                />
            </ThemeProvider>
        </MuiBox>
    )
}