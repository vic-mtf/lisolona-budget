import { 
    Paper, 
    Button,
    Box as MuiBox,
    DialogContent
} from '@mui/material';
import Carousel from './carousel/Carousel';
import CarouselItem from './carousel/CarouselItem';

export default function MultimediaContent ({items, value, handleChange, slideShow}) {

    return (
        <DialogContent
            sx={{m: 0, p: 0}}
        >
        <Carousel
            autoPlay={slideShow}
            value={value}
            onChange={num => handleChange(null, num)}
        >
            {items.map((item, index) => (<CarouselItem key={index} {...item} />))}
        </Carousel>
        </DialogContent>
    )
}