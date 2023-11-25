import { Virtuoso } from 'react-virtuoso';
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Badge, Fab, useTheme, Box as MuiBox, Zoom } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const MAX_PX_SHOW = 50;

export default React.memo (function ScrollDownButton({scrollerRef, virtuosoRef}) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const handleScrollToDown = useCallback(() => {
        const virtuoso = virtuosoRef?.current;
        const scroller = scrollerRef?.current;
        if(virtuoso)
            virtuoso.scrollTo({
                top: scroller.scrollHeight,
                behavior: "smooth",
            });
        setOpen(true);
    },[scrollerRef, virtuosoRef]);
    

    useEffect(() => {
        const scroller = scrollerRef?.current;
        const onScroll = event => {
            const element = event.currentTarget;
            const margin = element.scrollHeight - element.scrollTop - element.clientHeight;
            if(margin < MAX_PX_SHOW && open)
                setOpen(false);
            if(margin >= MAX_PX_SHOW && !open)
                setOpen(true);
        };
        scroller?.addEventListener("scroll", onScroll);
        return () => {
            scroller?.removeEventListener("scroll", onScroll);
        };

    }, [scrollerRef, open]);

    return (
        <Zoom 
            in={open}
            style={{
                position: 'absolute',
                zIndex: theme.zIndex.fab.toFixed(),
                right: theme.spacing(1.5),
                bottom: theme.spacing(1),
            }}
            className='_zoom-container'
            unmountOnExit
        >
            <Badge 
                badgeContent={0} 
                color="primary"
                showZero={false}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Fab
                    variant="circular"
                    size="small"
                    sx={{borderRadius: 1}} 
                    color="default"
                    onClick={handleScrollToDown}
                >
                    <KeyboardArrowDownOutlinedIcon fontSize="small" />
                    
                </Fab>
            </Badge>
        </Zoom>
    )
})