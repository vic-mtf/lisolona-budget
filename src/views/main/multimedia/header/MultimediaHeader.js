import { Toolbar } from "@mui/material";
import IconButton from "../../../../components/IconButton";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Typography from "../../../../components/Typography";
import SlideshowIcon from '@mui/icons-material/Slideshow';
import SlideShowButton from "./SlideShowButton";

export default function MultimediaHeader ({slideShow, setSlideShow, onClose, title}) {
    return (
        <Toolbar
            variant="dense"
            sx={{
                background: theme => theme.palette.background.paper + 
                theme.customOptions.opacity,
                backdropFilter:  theme => `blur(${theme.customOptions.blur})`,
            }}
        >
            <IconButton
                onClick={onClose}
            >
                <ArrowBackOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography mx={1} flexGrow={1}>Lisolo na budget - {title}</Typography>
            <SlideShowButton
                slideShow={slideShow} 
                setSlideShow={setSlideShow} 
            />
          </Toolbar>
    )
}