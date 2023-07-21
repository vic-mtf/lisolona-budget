import { Tooltip, Zoom } from "@mui/material";
import Typography from "../../../../../components/Typography";
import AnimatedWavingHand from "../../../../../components/WavingHand";
import IconButton from "../../../../../components/IconButton";

export default function RaiseHandView ({show, title}) {
    return (
        <Zoom in={show}>
            <Typography>
                <CustomTooltip 
                    arrow 
                    title={title}
                    show={show}
                >
                    <IconButton
                        //selected
                        disableFocusRipple
                        disableRipple
                        disableTouchRipple
                    >
                        <AnimatedWavingHand/>
                    </IconButton>
                </CustomTooltip>
            </Typography>
        </Zoom>
    );
}

const CustomTooltip = ({show, ...otherProps}) => show ? (<Tooltip {...otherProps} />) : otherProps.children
