
import { MenuItem, ThemeProvider, Tooltip } from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import React, { useCallback, useMemo } from 'react';
import Menu from '../../../../../components/Menu';
import { useState, useRef } from 'react';
import { useData } from '../../../../../utils/DataProvider';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import options from './options';

export default function CallButton  ({ target, theme }) {
    const mode = useSelector(store => store.meeting?.mode);
    const socket = useSocket();
    const disabled = useMemo(() => mode !==  'none', [mode]);
    const [{ secretCodeRef }] = useData();
    const [anchorEl, setAnchorEl] = useState(null);
    const anchorElRef = useRef();
    
    const onOpen = () => setAnchorEl(anchorElRef.current);

    const HandlerInitCall = useCallback((action, props) => () => {
        setAnchorEl(null);
        if(typeof action === 'function') action({
            target,
            secretCode: secretCodeRef.current,
            socket,
            ...props,
        })
    }, [secretCodeRef, socket, target]);

    return (
        <React.Fragment>
            <Tooltip title={disabled ? "Un appel en cours..." : "Lancer l'appel"} 
                arrow
            >
                <div>
                    <IconButton 
                        sx={{mx: 1}} 
                        disabled={disabled}
                        ref={anchorElRef}
                        onClick={() => 
                            target?.type === 'room' ? 
                            onOpen() : 
                            HandlerInitCall(
                                options[0].action,
                                { mode: 'outgoing' }
                            )()
                        }
                    >  
                        <LocalPhoneOutlinedIcon fontSize="small"/>
                        {target?.type === "room" && <ExpandMoreIcon fontSize="small"/>}
                    </IconButton>
                </div>
            </Tooltip>
            <ThemeProvider theme={theme}>
                <Menu
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    sx={{
                        '& .MuiMenuItem-root': {
                            '& .MuiSvgIcon-root': {
                                fontSize: 18,
                                color: theme.palette.text.secondary,
                                marginRight: theme.spacing(1.5),
                            },
                        }
                    }}
                >
                    {options.map(({ label, icon, disabled, action }, key) => (
                        <MenuItem 
                            key={key}
                            disabled={disabled}
                            onClick={HandlerInitCall(action)}
                        > 
                        {React.createElement(icon, { fontSize: 'small' })} {label}
                        </MenuItem>
                    ))}
                </Menu>
            </ThemeProvider>
        </React.Fragment>
    )
}