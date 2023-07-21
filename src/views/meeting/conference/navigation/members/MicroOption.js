import { Tooltip } from "@mui/material";
import IconButton from "../../../../../components/IconButton";
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import { useLayoutEffect, useState } from "react";

export default function MicroOption ({active, onDesactiveMicro}) {
   

    return (
        <Tooltip
            title={`${active ? 'Desactiver' : 'Activer'} le micro`}
            arrow
        >
            <div>
                <IconButton
                    disabled={!active}
                    onClick={onDesactiveMicro}
                    selected={active}
                >
                    {active ? <MicNoneOutlinedIcon/> : <MicOffOutlinedIcon/>}
                </IconButton>
            </div>
        </Tooltip>
    );
}