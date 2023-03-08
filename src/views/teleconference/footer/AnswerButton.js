import PhoneIcon from '@mui/icons-material/Phone';
import { Fab, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTeleconference } from '../../../utils/useTeleconferenceProvider';
import { useSocket } from '../../../utils/SocketIOProvider';

export default function AnswerButton () {
  const { setPickedUp } = useTeleconference();
  const {from, type} = useSelector(store => {
    const clientId = store?.teleconference?.clientId;
    const contact = store.data?.contacts?.find(({id}) => id === clientId);
    const type = contact ? 'direct' : 'room';
    const from = clientId;
    console.log(type, from, store.user.id);
    return {from, type};
  });
  const socket = useSocket();
  const hanldeAnswerCall = () => {
      socket.emit('pick-up',{
        from,
        type,
      });
      setPickedUp(true);
  };
  
  return (
    <Tooltip 
        title="Repondre" 
        arrow
    >
    <Fab
        color="success"
        sx={{mx: 1}}
        onClick={hanldeAnswerCall}
        size="small"
    >
        <PhoneIcon fontSize="small" />
    </Fab>
    </Tooltip>
  )
}