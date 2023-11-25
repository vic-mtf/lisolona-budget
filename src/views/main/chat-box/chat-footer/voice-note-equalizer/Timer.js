import Typography from "../../../../../components/Typography"
import formatTime from "../../../../../utils/formatTime";
import useTimer from "./useTimer";

export default function Timer ({timeoutRef}) {
    timeoutRef.current = useTimer(true, timeoutRef);

    return (
        <Typography 
            fontWeight="bold"
            color="text.secondary"
        >{formatTime({currentTime: timeoutRef.current/ 1000}).trim()}
        </Typography>
    )
}