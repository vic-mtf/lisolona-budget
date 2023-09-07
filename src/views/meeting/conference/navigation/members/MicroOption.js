import { Tooltip } from "@mui/material";
import IconButton from "../../../../../components/IconButton";
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import { useMemo } from "react";
import useMicroProps from "../../footer/buttons/useMicroProps";
import { useSelector } from "react-redux";
import useClientState from "../../actions/useClientState";
import { useSocket } from "../../../../../utils/SocketIOProvider";

export default function MicroOption ({active, id}) {
    const user = useSelector(store => store.meeting.me);
    const meetingId = useSelector(store => store.meeting.meetingId);
    const isLocalMicro = useMemo(() => user?.id === id, [id, user]);
    const {micro, handleToggleMicro, loading} = useMicroProps();
    const state = useClientState({id: user.id, props: ['isAdmin']});
    const activeMicro = useMemo(() => isLocalMicro ? micro?.active : active, [isLocalMicro, micro, active]);
    const socket = useSocket();


    const IconButtonProps = useMemo(() => state.isAdmin ? {
        onClick() {
            if(isLocalMicro) handleToggleMicro();
            else if(state.isAdmin)
                socket.emit('signal', {
                    id: meetingId,
                    type: 'state',
                    obj: {isMic: false},
                    who: [id],
                });
        }
    }: {
        disableFocusRipple: true,
        disableRipple: true,
        disableTouchRipple: true,
        onClick() {
            if(isLocalMicro) handleToggleMicro();
        }
    }, [state, meetingId, handleToggleMicro, isLocalMicro, id, socket])

    return (
        <Tooltip
            title={message(activeMicro, state.isAdmin)}
            arrow
        >
            <div>
                <IconButton
                    disabled={isLocalMicro ? loading : !active }
                    {...IconButtonProps}
                    selected={activeMicro}
                    
                >
                    {activeMicro ? 
                    <MicNoneOutlinedIcon/> : <MicOffOutlinedIcon/>}
                </IconButton>
            </div>
        </Tooltip>
    );
}

const message = (active, isAdmin) => isAdmin ? 
`${active ? 'Desactiver' : 'Activer'} le micro` : `Micron ${active ? 'Activé' : 'Desactivé'}`