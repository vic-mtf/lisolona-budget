import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Badge, Fab, useTheme, Box as MuiBox, Zoom } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const MAX_PX_SHOW = 60;

export default React.memo (function ScrollDownButton({scrollerRef, virtuosoRef, data}) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const lenRef = useRef(data?.length);
    const [news, setNews] = useState(0);

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

    useEffect(() => {
        if(open && lenRef.current !== data?.length) 
            setNews(data?.length - lenRef.current);
        
        if(!open && lenRef.current !== data?.length) {
            const scroller = scrollerRef?.current;
            scroller.scrollTo({
                top: scroller.scrollHeight,
                behavior: "auto",
            });
            if(lenRef.current !== data?.length) setNews(0)
            lenRef.current = data?.length;
        }   
    }, [open, data, handleScrollToDown, virtuosoRef, scrollerRef]);

    return (
        <Zoom 
            in={open}
            style={{
                position: 'absolute',
                zIndex: theme.zIndex.fab.toFixed() +100,
                right: theme.spacing(1),
                bottom: theme.spacing(1),
            }}
            className='_zoom-container'
            // unmountOnExit
        >
            <Badge 
                badgeContent={news} 
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
                    sx={{
                        borderRadius: 1, 
                        zIndex: theme => news ? 0 : theme.zIndex.fab.toFixed(),
                    }} 
                    color="default"
                    onClick={handleScrollToDown}
                >
                    <KeyboardArrowDownOutlinedIcon fontSize="small" />
                    
                </Fab>
            </Badge>
        </Zoom>
    )
})