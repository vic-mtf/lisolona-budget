import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toolbar } from '@mui/material';
import Typography from '../../../../../components/Typography';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import IconButton from '../../../../../components/IconButton';
import AvatarStatus from '../../../../../components/AvatarStatus';
import { findUser } from '../../../../../utils/MeetingProvider';
import getFullName from '../../../../../utils/getFullName';
import store from '../../../../../redux/store';
import { togglePinId } from '../../../../../redux/conference';

export default function PresentHeader ({rootRef, id}) {
    const [open, setOpen] = useState(true);
    const [stay, setStay] = useState(false);
    const timerRef = useRef();
    const user = useMemo(() => findUser(id), [id]);

    const startTimer = useCallback(() => {
        timerRef.current = window.setTimeout(() => {
            setOpen(false);
        }, 5000);
    }, []);

    useEffect(() => {
        startTimer();
    }, [startTimer]);

    const variants = {
        hidden: { opacity: 0, transform: 'translateY(-100%)' },
        visible: { opacity: 1, transform: 'translateY(0%)' },
    };

    const handleTimer = useCallback(() => {
        window.clearTimeout(timerRef.current);
        setOpen(true);
        startTimer();
    }, [startTimer]);

    const handleLeave = useCallback(() => {
        window.clearTimeout(timerRef.current); 
        setOpen(false);
    }, []);

    const handleClick = useCallback(() => {
        if(open) { 
            handleLeave()
        } else handleTimer();
    }, [open, handleTimer, handleLeave]);

    

    useEffect(() => {
        const root = rootRef?.current;
        if(root && !stay) {
            root?.addEventListener('mouseenter', handleTimer);
            root?.addEventListener('mousemove', handleTimer);
            root?.addEventListener('mouseleave', handleLeave);
            root?.addEventListener('click', handleClick);
        }
        return () => {
            root?.removeEventListener('mouseenter', handleTimer);
            root?.removeEventListener('mousemove', handleTimer);
            root?.removeEventListener('mouseleave', handleLeave);
            root?.removeEventListener('click', handleClick);
            window.clearTimeout(timerRef.current);
        };
    }, [rootRef, handleTimer, handleClick, handleLeave, stay]);

    return (
        <AnimatePresence>
           {open &&
           <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.5 }}
                style={{
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <Toolbar
                    variant="dense"
                    onMouseEnter={() => setStay(true)}
                    onMouseLeave={() => setStay(false)}
                    sx={{
                        background: theme => theme.palette.background.paper + 
                        theme.customOptions.opacity,
                        border: theme => `1px solid ${theme.palette.divider}`,
                        backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                    }}
                >
                    <IconButton 
                        sx={{mr: 1.5}}
                        onClick={() => {
                            store.dispatch(
                                togglePinId({
                                    pinId: null,
                                })
                            )
                        }}
                    >
                        <ArrowBackOutlinedIcon fontSize="small"/>
                    </IconButton>
                    <AvatarStatus
                        invisible
                        name={getFullName(user?.identity)}
                        avatarSrc={user?.identity?.imageUrl}
                        id={id}
                    />
                    <Typography variant="body1" component="div">
                        {getFullName(user?.identity)}
                    </Typography>
                </Toolbar>
            </motion.div>}
        </AnimatePresence>
      );
}
