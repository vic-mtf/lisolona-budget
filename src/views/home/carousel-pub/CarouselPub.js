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
        >
            
            <Carousel sx={{width: 500}} animation="fade" duration={800} interval={6000}>
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
               background: 'none'
            }}
            elevation={0}
        >
            <CardMedia
                sx={{
                    height: 300,
                    width: 300,
                    borderRadius: '50%'
                }}
                component="img"
                {...props}
            />
            <CardContent>
                <Typography>{props.desc}</Typography>
            </CardContent>
        </Card>
    )
}