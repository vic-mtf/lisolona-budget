import { useStopwatch } from "react-timer-hook"
import Typography from "../../../../../components/Typography"

export default function Timer () {
    const {seconds, minutes} = useStopwatch({autoStart: true});
    return (
        <Typography 
            variant="body1" 
            fontWeight="bold"
            color="text.secondary"
        >
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </Typography>
    )
}