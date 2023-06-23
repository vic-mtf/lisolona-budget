import Typography from "../../../../../components/Typography"
import getFormatTime from "../../../../../utils/getFormatTime";
import useTimer from "./useTimer";

export default function Timer ({timeoutRef}) {
    timeoutRef.current = useTimer(true, timeoutRef);

    return (
        <Typography 
            fontWeight="bold"
            color="text.secondary"
        >{getFormatTime({currentTime: timeoutRef.current/ 1000}).trim()}
        </Typography>
    )
}