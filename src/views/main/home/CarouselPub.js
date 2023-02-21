import _image_geid_2 from '../../../assets/_DSC7640.webp';
import _image_geid_1 from '../../../assets/Formation-communication-pour-mobiliser-une-équipe-et-atteindre-les-objectifs.61a9e5647a6125a47f0f.jpg';
import _image_geid_3 from '../../../assets/jz0PQv2kyNeRBckhJ9C0JKstjs97Xl6DVh9C87tKyDE=_plaintext_638048881106560813.jpeg';

import {
    Box as MuiBox,
    Card,
    CardMedia,
} from '@mui/material/';
import Carousel from 'react-material-ui-carousel';

export default function CarouselPub () {

    return (
        <MuiBox 
            display="inline-block" 
            position="relative" 
            draggable={false}
        >
            
            <Carousel sx={{width: 500}} animation="slide" duration={800} interval={6000}>
                {
                    items.map( (item, i) => <Item key={i} {...item} /> )
                }
            </Carousel>
        </MuiBox>
    )
}

const  items = [
    { src: _image_geid_3 },
    { src: _image_geid_1 },
    { src: _image_geid_2 },
]

const Item = props => {
    return (
        <Card>
            <CardMedia
                sx={{
                    height: 250,
                }}
                component="img"
                {...props}
            />
        </Card>
    )
}