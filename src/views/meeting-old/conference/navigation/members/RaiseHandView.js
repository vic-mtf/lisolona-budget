import { Tooltip } from "@mui/material";
import Typography from "../../../../../components/Typography";
import AnimatedWavingHand from "../../../../../components/WavingHand";
import IconButton from "../../../../../components/IconButton";
import { useMemo } from "react";
import store from "../../../../../redux/store";
import { useSelector } from "react-redux";
import CustomZoom from '../../../../../components/CustomZoom';

export default function RaiseHandView ({show, title, id}) {
    const handRaised = useSelector(store => store.conference.handRaised);
    const isLocalMicro = useMemo(() => store.getState().meeting.me?.id === id, [id]);
    const showHand = useMemo(() => isLocalMicro ? handRaised : show, [handRaised, show, isLocalMicro]);

    return (
        <CustomZoom show={showHand}>
            <Typography>
                <CustomTooltip 
                    arrow 
                    title={title}
                    show={showHand}
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
        </CustomZoom>
    );
}

const CustomTooltip = ({show, ...otherProps}) => show ? (<Tooltip {...otherProps} />) : otherProps.children
