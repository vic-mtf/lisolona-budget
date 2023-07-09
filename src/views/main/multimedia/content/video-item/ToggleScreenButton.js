import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import IconButton from '../../../../../components/IconButton';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export default function ToggleScreenButton({videoRef}) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const isAutoActionRef = useRef(true);

    const handleFullScreen = useCallback(({isManuelAction}) => {
        if(isAutoActionRef.current)
            setIsFullScreen(screen => {
                if(isManuelAction) isAutoActionRef.current = false;
                if(screen) document?.exitFullscreen();
                else videoRef.current.parentNode.requestFullscreen();
                return !screen
            });
        else isAutoActionRef.current = true;
    }, [videoRef]);

    useLayoutEffect(() => {
        const {current: video} = videoRef
        document.addEventListener(
            'fullscreenchange', 
            handleFullScreen
        );
        const onDblClick = () => handleFullScreen({isManuelAction: true});
        video.parentNode
        .addEventListener('dblclick', onDblClick);
        return () => {
            document.removeEventListener(
                'fullscreenchange', 
                handleFullScreen
            );
            video.parentNode
            .removeEventListener('dblclick', onDblClick);
        }
    },[handleFullScreen, videoRef]);

    return (
        <IconButton
            onClick={() => handleFullScreen({isManuelAction: true})}
        >
            {isFullScreen ? 
            <FullscreenExitOutlinedIcon /> : 
            <FullscreenOutlinedIcon />}
        </IconButton>
    );

}