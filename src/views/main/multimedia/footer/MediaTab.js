import {
    Card,
    CardActionArea,
    CardMedia,
    Box as MuiBox, Paper
} from '@mui/material';
import PictureThumb from './PictureThumb';
import VideoThumb from './VideoThumb';

export default function MediaTab (props) {
    const {selected, onChange, value, item} = props;
    return (
        <MuiBox
            width={70}
            height={70}
            m={.2}
        >
            <Card 
                elevation={0}
                sx={{
                    overflow: 'clip',
                    background: 'none',
                    border: theme => 
                    `3px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
                    borderRadius: 2,
                }}
            >
                <CardActionArea
                    onClick={event => onChange(event, value)}
                > {item.subType === 'video' ? 
                <VideoThumb src={item.urls.small}/> :
                <PictureThumb src={item.urls.thumb}/>
                }
            </CardActionArea>
            </Card>
        </MuiBox>
    );
}