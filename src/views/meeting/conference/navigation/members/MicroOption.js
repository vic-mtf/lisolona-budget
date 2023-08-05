import { Tooltip } from "@mui/material";
import IconButton from "../../../../../components/IconButton";
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import { useMemo } from "react";
import store from "../../../../../redux/store";
import useMicroProps from "../../footer/buttons/useMicroProps";

export default function MicroOption ({active, onDesactiveMicro, id}) {
    const isLocalMicro = useMemo(() => store.getState().meeting.me?.id === id, [id]);
    const {micro, handleToggleMicro, loading} = useMicroProps();
    const activeMicro = useMemo(() => isLocalMicro ? micro?.active : active, [isLocalMicro, micro, active]);

    return (
        <Tooltip
            title={`${activeMicro ? 'Desactiver' : 'Activer'} le micro`}
            arrow
        >
            <div>
                <IconButton
                    disabled={isLocalMicro ? loading : !active }
                    onClick={isLocalMicro ? handleToggleMicro : onDesactiveMicro}
                    selected={activeMicro}
                >
                    {activeMicro ? 
                    <MicNoneOutlinedIcon/> : <MicOffOutlinedIcon/>}
                </IconButton>
            </div>
        </Tooltip>
    );
}