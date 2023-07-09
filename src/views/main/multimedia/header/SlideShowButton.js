import { Tooltip } from "@mui/material";
import IconButton from "../../../../components/IconButton";
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import PausePresentationOutlinedIcon from '@mui/icons-material/PausePresentationOutlined';

export default function SlideShowButton ({slideShow, setSlideShow}) {
    return (
        <Tooltip title={slideShow ? "Arreter le diaporama" : "Lire en lire en diaporama" }>
            <IconButton
                sx={{mx: 1,}}
                onClick={() => setSlideShow(state => !state)}
            >
                {slideShow ?
                <PausePresentationOutlinedIcon fontSize="small" /> :
                <SmartDisplayOutlinedIcon fontSize="small" />}
            </IconButton>
        </Tooltip>
    )
}