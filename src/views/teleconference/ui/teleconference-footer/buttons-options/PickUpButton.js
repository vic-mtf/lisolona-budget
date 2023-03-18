import {
    Fab
} from '@mui/material';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { useTeleconference } from '../../../../../utils/TeleconferenceProvider';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../../../redux/teleconference';
export default function PickUpButton () {
    const [
        {audio}, 
        {handlePublishLocalTracks}
    ] = useTeleconference();
    const dispatch = useDispatch();
    const {from, type, joined} = useSelector(store => {
        const type = store.teleconference.type;
        const from = type === 'room' ? 
        store.teleconference.meetingId : 
        store.teleconference.from;
        const joined = store.teleconference.joined;
        return {from, type, joined};
    });
    const socket = useSocket();
    const handlePickUp = async () => {
        audio.src = null;
        socket.emit('pick-up', {from, type});
        dispatch(addTeleconference({
            key: 'data',
            data: {
                meetingMode: 'on',
                videoMirrorMode: 'float',
            }
        }));
        if(joined) {
            handlePublishLocalTracks();
        } else {
            let timer, autoPickUp;
            (autoPickUp = () => {
                timer = window.setTimeout(() => {
                    window.clearTimeout(timer);
                    if(joined) handlePublishLocalTracks();
                    else autoPickUp()
                }, 200);
            })();
        }

    };

    return (
        <Fab
            color="success"
            sx={{boxShadow: 0}}
            size="small"
            variant="extended"
            onClick={handlePickUp}
        >
          <LocalPhoneOutlinedIcon fontSize="small" />
        </Fab>
    )
}