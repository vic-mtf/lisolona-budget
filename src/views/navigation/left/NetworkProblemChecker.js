import useOnLine from "../../../utils/useOnLine"
import { Alert, Slide } from "@mui/material";
import SignalWifiBadOutlinedIcon from '@mui/icons-material/SignalWifiBadOutlined';

export default function NetworkProblemChecker ({direction}) {
    const error = !useOnLine();
    return error && (
        <Slide 
            in={error} 
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