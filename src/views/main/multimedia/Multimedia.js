import { Dialog, Divider } from '@mui/material'
import MultimediaHeader from './header/MultimediaHeader';
import MultimediaContent from './content/MultimediaContent';
import { useCallback, useEffect, useRef, useState } from 'react';
import MultimediaFooter from './footer/MultimediaFooter';
import { useLayoutEffect } from 'react';

export default function Multimedia ({items, defaultValue, open, onClose, headerTitle}) {
    const [value, setValue] = useState(defaultValue > 0 ? defaultValue : 0);
    const [slideShow, setSlideShow] = useState(false);
    const openRef = useRef(false);
    const handleChange = useCallback((event, newValue) => {
        setValue(newValue);
        if(newValue === items.length - 1 && slideShow) 
            setSlideShow(false)
    }, [slideShow, items.length]);

    useLayoutEffect(() => {
        if(!openRef.current && defaultValue > 0) {
            setValue(defaultValue);
            openRef.current = true;
        }
        if(openRef.current && defaultValue < 0) 
            openRef.current = false;
    }, [defaultValue])

    return (
        <Dialog 
            open={open && defaultValue > -1} 
            fullScreen
            sx={{
                '& .MuiDialog-paperFullScreen': {
                    background: 'none'
                },
            }}
            BackdropProps={{
                sx: {
                    background: theme => theme.palette.background.paper + 
                    theme.customOptions.opacity,
                    backdropFilter:  theme => `blur(${theme.customOptions.blur})`,
                }
            }}
        >
            <MultimediaHeader
                value={value}
                slideShow={slideShow}
                setSlideShow={setSlideShow}
                onClose={onClose}
                title={headerTitle}
            />
            <Divider/>
            <MultimediaContent
                value={value}
                items={items}
                handleChange={handleChange}
                slideShow={slideShow}
                setSlideShow={setSlideShow}
            />
            <Divider/>
            <MultimediaFooter
                value={value}
                items={items}
                handleChange={handleChange}
            />
        </Dialog>
    );
}

Multimedia.defaultProps = {
    items: [],
    defaultValue: 0,
    open: false,
    onClose: () => {}
};