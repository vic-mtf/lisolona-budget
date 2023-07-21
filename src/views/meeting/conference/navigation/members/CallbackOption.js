import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Stack, Tooltip, Zoom } from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LoadingIndicator from './LoadingIndicator';
import { useSocket } from '../../../../../utils/SocketIOProvider';


export default function CallbackOption({rootRef, id}) {
    const [show, setShow] = useState(false);
    const [ringing, setRinging] = useState(false);
    const socket = useSocket();
    const timerRef = useRef();

    const handleRinging = useCallback((event) => {
        const member = event?.who;
        window.setTimeout(timerRef.current);
        if(member._id === id) {
            if(!ringing) setRinging(true);
            timerRef.current = setTimeout(() => {
                setRinging(false);
            }, 1500);
        }
    }, [id, ringing]);

    const handleCallback = useCallback((event) => {
        socket.emit('call');
        handleRinging({who: {_id: id}});
    }, [socket, handleRinging, id]);

    useLayoutEffect(() => {
        socket.on('ringing', handleRinging);
        return () => {
            socket.off('ringing', handleRinging);
        }
    }, [socket, handleRinging]);

    useLayoutEffect(() => {
        const onMouseEnter = () => {
            if(!show) setShow(true);
        }
        const onMouseLeave = () => {
            if(show) setShow(false);
        }
        rootRef?.current?.addEventListener('mouseenter', onMouseEnter);
        rootRef?.current?.addEventListener('mouseleave', onMouseLeave);
        return () => {
            socket.off('ringing', handleRinging);
            rootRef?.current?.removeEventListener('mouseenter', onMouseEnter);
            rootRef?.current?.removeEventListener('mouseleave', onMouseLeave);
        }
    }, [socket, handleRinging, rootRef, show]);

    return (
        <Stack>   
            <Zoom in={show || ringing}>
                <div>   
                    <Tooltip title={ringing ? "Appel en cours..." : "Rappeler"} 
                        arrow
                    >   
                        <div>    
                            {ringing ? 
                            (
                                <LoadingIndicator/>
                            ):
                            (
                            <IconButton
                                onClick={handleCallback}
                            >
                                <LocalPhoneOutlinedIcon fontSize="small"/>
                            </IconButton>
                            )}
                        </div>  
                    </Tooltip> 
                </div>   
            </Zoom>
        </Stack>
    );
}