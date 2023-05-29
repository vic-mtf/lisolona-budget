
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
import VolumeMuteOutlinedIcon from '@mui/icons-material/VolumeMuteOutlined';
import VolumeDownOutlinedIcon from '@mui/icons-material/VolumeDownOutlined';
import IconButton from '../../../../../components/IconButton';
import React, { useCallback, useRef, useState } from 'react';
import { Fade, Popper, Box as MuiBox, Slider, Paper } from '@mui/material';

export default function VolumeButtonSlider ({anchorElRef, videoRef}) {
    const [volume, setVolume] = useState(videoRef?.current?.volume * 100);
    const [muted, setMuted] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const containerRef = useRef();
    const handleOpenVolumeSlider = useCallback(open => () => {
        setAnchorEl(open ? anchorElRef?.current : null);
    }, [anchorElRef]);
    const handleVolumeChange = useCallback((event, newValue) => { 
        setVolume(newValue);
        videoRef.current.volume = newValue / 100;
    }, [videoRef]);
    const handleToggleValue = useCallback(() => 
        setMuted(muted => {
            const value = !muted;
            videoRef.current.muted = value;
            return value;
        }), [videoRef]);

    return (
        <MuiBox
            onMouseEnter={(anchorEl === null && handleOpenVolumeSlider(true)) || null}
            onMouseLeave={(anchorEl && handleOpenVolumeSlider(false)) || null}
            ref={containerRef}
        >
            <Popper  
                open={Boolean(anchorEl && !muted)} 
                anchorEl={anchorEl} 
                transition
                placement="top-end"
                container={() => containerRef.current}
                sx={{
                    zIndex: theme => theme.zIndex.tooltip,
                }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <MuiBox 
                            bgcolor="divider"
                            borderRadius={2}
                            component={Paper}
                            elevation={3}
                            mb={1}
                            height={120}
                            px={.5}
                            py={2}
                            sx={{
                               backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                                background: theme => theme.palette.background.paper + 
                                theme.customOptions.opacity,
                            }}
                        >
                            <Slider
                                orientation="vertical"
                                getAriaValueText={value => value}
                                valueLabelDisplay="auto"
                                size="small"
                                max={100}
                                min={0}
                                value={volume}
                                disabled={muted}
                                onChange={handleVolumeChange}
                                //defaultValue={}
                            />
                        </MuiBox>
                    </Fade>
                )}
            </Popper>
            <IconButton
                onClick={handleToggleValue}
            >
                <IconValume volume={volume} muted={muted}/>
            </IconButton>
        </MuiBox>
    );
    
}

const IconValume = ({volume, muted}) => {
    if(muted)
        return <VolumeOffOutlinedIcon/>;
    if(volume > 50)
        return <VolumeUpOutlinedIcon/>;
    if(volume > 0)
        return <VolumeDownOutlinedIcon/>;
    return <VolumeMuteOutlinedIcon/>;
}