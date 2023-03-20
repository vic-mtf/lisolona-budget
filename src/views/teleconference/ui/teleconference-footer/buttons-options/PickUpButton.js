import { Fab } from '@mui/material';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { useTeleconference } from '../../../../../utils/TeleconferenceProvider';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../../../redux/teleconference';
import usePublishLocalTracks from '../../../actions/publish/usePublishLocalTracks';
export default function PickUpButton () {
    const [{audio}] = useTeleconference();
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
    const onPublishLocalTracks = usePublishLocalTracks();

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
        if(joined) onPublishLocalTracks()
        else {
            let timer, autoPickUp;
            (autoPickUp = () => {
                timer = window.setTimeout(() => {
                    window.clearTimeout(timer);
                    if(joined) onPublishLocalTracks();
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