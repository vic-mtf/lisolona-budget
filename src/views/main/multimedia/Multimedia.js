import { Dialog, Divider } from '@mui/material'
import MultimediaHeader from './header/MultimediaHeader';
import MultimediaContent from './content/MultimediaContent';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MultimediaFooter from './footer/MultimediaFooter';
import { useLayoutEffect } from 'react';
import timeHumanReadable from '../../../utils/timeHumanReadable';

export default function Multimedia ({items, defaultValue, open, onClose, headerTitle}) {
    const [value, setValue] = useState(defaultValue > 0 ? defaultValue : 0);
    const [slideShow, setSlideShow] = useState(false);
    const openRef = useRef(false);
    const handleChange = useCallback((event, newValue) => {
        setValue(newValue);
        if(newValue === items.length - 1 && slideShow) 
            setSlideShow(false)
    }, [slideShow, items.length]);

    const userInfos = useMemo(() => {
        const media = items[value];
        let title;
        if(media) {
            title = headerTitle || `envoyé par ${
                media.isMine ? 'vous' : media.name
            }, ${
                timeHumanReadable(media.createdAt, true)
            }`;
        }
        return {
            headerTitle: title,
        }
    }, [items, value, headerTitle])

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
                title={userInfos?.headerTitle}
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