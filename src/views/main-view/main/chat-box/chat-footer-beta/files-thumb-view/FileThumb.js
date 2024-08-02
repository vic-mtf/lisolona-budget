import {
    Card,
    CardActionArea,
    Box as MuiBox
} from '@mui/material';
import VideoThumb from './VideoThumb';
import PictureThumb from './PictureThumb';
import IconButton from '../../../../../components/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DocThumb from './DocThumb';
import humanReadableSize from '../../../../../utils/humanReadableSize';
import Typography from '../../../../../components/Typography';
import formatTime from '../../../../../utils/formatTime';
import React from 'react';

export default function FileThumb ({type, url, onRemoveFile, onOpen, file}) {

    return (
        <MuiBox
            overflow="visible"
        >
            <Card 
                elevation={0}
                sx={{
                    overflow: 'height',
                    background: 'none',
                    position: 'relative',
                    height: 98,
                    width: 98,

                }}
            >
                <CardActionArea
                    onClick={onOpen}
                > 
                    {<Thumb 
                        type={type} 
                        url={url} 
                        file={file}
                    />}
                </CardActionArea>
                <MuiBox
                    position="absolute"
                    top={0}
                    right={0}
                    px={.5}
                >
                    <IconButton
                        onClick={onRemoveFile}
                        sx={{
                            background: theme => theme.palette.background.paper + 
                            theme.customOptions.opacity,
                            backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                            border:  theme => `1px solid ${theme.palette.divider}`,
                            height: 15,
                            width: 15
                        }}
                    >
                        <CloseRoundedIcon sx={{fontSize: '15px'}}/>
                    </IconButton>
                </MuiBox>
            </Card>
        </MuiBox>
    );
}

const Thumb = React.memo(({type, url, file}) => {
    switch(type) {
        case 'video':
            return <VideoThumb src={url} size={file.File.size}/>;
        case 'image':
            return <PictureThumb src={url} size={file.File.size}/>;
        default: 
            return <DocThumb src={url} name={file.File.name} type={file.File.type} size={file.File.size} />
    }
});

export const FastDetail = React.memo(({size, duration}) => {
    return (
        <Typography
            variant="caption"
            fontSize="80%"
            component="span"
            px={.5}
        >
        {Boolean(size) && humanReadableSize(size, 1024, 0)}
        {typeof duration === 'number' ?  ' | ' + formatTime({currentTime: duration}) : ''}
        </Typography>
    )
});