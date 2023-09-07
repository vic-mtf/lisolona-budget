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
import getFormatTime from '../../../../../utils/getFormatTime';

export default function FileThumb ({type, url, onRemoveFile, onOpen, file}) {

    return (
        <MuiBox
            width={100}
            height={100}
            mx={.5}
        >
            <Card 
                elevation={0}
                sx={{
                    overflow: 'clip',
                    background: 'none',
                    position: 'relative',
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

const Thumb = ({type, url, file}) => {
    switch(type) {
        case 'video':
            return <VideoThumb src={url} size={file.File.size}/>;
        case 'image':
            return <PictureThumb src={url} size={file.File.size}/>;
        default: 
            return <DocThumb src={url} name={file.File.name} type={file.File.type} size={file.File.size} />
    }
}

export const FastDetail = ({size, duration}) => {
    return (
        <Typography
            variant="caption"
            fontSize="80%"
            component="span"
            px={.5}
        >
        {Boolean(size) && humanReadableSize(size, 1024, 0)}
        {typeof duration === 'number' ?  ' | ' + getFormatTime({currentTime: duration}) : ''}
        </Typography>
    )
};