import { useStopwatch } from "react-timer-hook";
import Typography from "../../../components/Typography";

export default function CallTimer () {
    const {
        seconds,
        minutes,
        hours,
      } = useStopwatch({ autoStart: true })
    
    return (
        <Typography variant="body1" mx={1}>
            {
            hours ? hours + ' : ' : ''
            }{
            minutes.toString().padStart(2, '0')
            } : {
            seconds.toString().padStart(2, '0')
            }
        </Typography>
    )
}