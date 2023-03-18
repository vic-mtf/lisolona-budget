import {
    Box as MuiBox, Card, createTheme, Slide, ThemeProvider, Toolbar, Tooltip
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';
import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '../../../../../components/IconButton';
import { useDispatch } from 'react-redux';
import { addTeleconference } from '../../../../../redux/teleconference';

export default function FloatFrame ({children}) {
    const elRef = useRef();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const handleChangeMirrorMode = data => () => 
        dispatch(addTeleconference({
            key: 'videoMirrorMode',
            data,
        }))

    useEffect(() => {
        interact(elRef.current)
        .draggable({
          inertia: true,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: 'parent',
              endOnly: true
            })
          ],
          autoScroll: false,
      
          listeners: {
            move({target, dx, dy}) {
                let x = (parseFloat(target.getAttribute('data-x')) || 0) + dx;
                let y = (parseFloat(target.getAttribute('data-y')) || 0) + dy;
                target.style.transform = `translate(${x}px,${y}px)`;
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
              },
          }
        });
    })
    return (
        <MuiBox
            ref={elRef}
            component={Card}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1000,
                display: 'flex',
                position: 'absolute',
                height: 112.25,
                width: 200,
                right: '10px',
                top: '10px',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center'
                
            }}
        >
            <ThemeProvider theme={createTheme({palette: { mode: 'dark'}})}>
                <Slide
                    in={open}
                >
                    <Toolbar
                        variant="dense"
                        disableGutters
                        sx={{
                            position: 'absolute',
                            top: '-5px',
                            right: 0,
                            zIndex: theme => theme.zIndex.drawer + 100
                        }}
                    >
                        <Tooltip 
                            arrow 
                            title="Afficher dans l'écran d'appel"
                        >
                            <IconButton
                                sx={{mx: 1}}
                                onClick={handleChangeMirrorMode('grid')}
                            >
                                <CoPresentOutlinedIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip 
                            arrow 
                            title="Cacher"
                        >
                            <IconButton
                                sx={{mx: 1}}
                                onClick={handleChangeMirrorMode('none')}
                            >
                                <CloseOutlinedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Slide>
            </ThemeProvider>
            {children}
        </MuiBox>
    )
}