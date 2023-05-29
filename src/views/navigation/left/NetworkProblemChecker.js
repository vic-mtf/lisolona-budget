import useOnLine from "../../../utils/useOnLine"
import { Alert, Slide } from "@mui/material";
import SignalWifiBadOutlinedIcon from '@mui/icons-material/SignalWifiBadOutlined';
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setStatus } from "../../../redux/status";

export default function NetworkProblemChecker ({direction}) {
    const online = useOnLine();
    const dispatch = useDispatch();
    const open = useMemo(() => !online, [online])
    useEffect(() => {
        if(open) dispatch(setStatus({}));
    }, [open, dispatch]);
    
    return open && (
        <Slide 
            in={open} 
            direction={direction}
        >
            <Alert
                icon={<SignalWifiBadOutlinedIcon/>}
                severity="warning"
            >
            <b>Lisolo Na Budget</b> peine à récupérer des données, 
            votre appareil n'est plus relié au réseau Internet.
            </Alert>
        </Slide>
    )
}
NetworkProblemChecker.defaultProps = {
    direction: 'up',
}