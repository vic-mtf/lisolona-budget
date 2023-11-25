import {
    Box as MuiBox,
    Card,
    CardMedia,
    CardContent,
} from '@mui/material/';
import Carousel from 'react-material-ui-carousel';
import pubs from './pubs';
import Typography from '../../../components/Typography';

export default function CarouselPub () {

    return (
        <MuiBox 
            position="relative" 
            draggable={false}
            display="flex"
            justifyContent="center"
            width={{
                width: '100%',
                overflow: 'hidden',
            }}
        >
            
            <Carousel 
                sx={{
                    width: '100%', 
                    maxWidth: 600,
                }} 
                animation="fade" 
                duration={800} 
                interval={6000}
            >
                {
                    pubs.map( (item, i) => <Item key={i} {...item} /> )
                }
            </Carousel>
        </MuiBox>
    )
}

const Item = props => {
    return (
        <Card
            sx={{
               display: 'flex',
               justifyContent: 'center',
               flexDirection: 'column',
               alignItems: 'center',
               background: 'none',
               height: '100%',
               display: 'flex',
               userSelect: 'none',
            }}
            elevation={0}
        >
            <CardMedia
                sx={{
                    height: 300,
                    maxWidth: 300,
                    borderRadius: 2,
                    boxShadow: 5,
                    borderRadius: 50,
                    m: 2,
                    "& > img": {
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        overflow: 'hidden',
                        cursor: 'none',
                    },
                    
                }}
                component="img"
                draggable={false}
                {...props}
            />
            <CardContent sx={{maxWidth: 500, height: 100}}>
                <Typography
                    variant="body1"
                >{props.desc}</Typography>
            </CardContent>
        </Card>
    )
}