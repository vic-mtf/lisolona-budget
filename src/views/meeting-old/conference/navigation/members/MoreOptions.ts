import { Tooltip } from "@mui/material";
import IconButton from "../../../../../components/IconButton";
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

export default function MoreOptions ({onClick, rootRef, buttonRef}) {
    return (
        <Tooltip
            title="Plus d'options"
            arrow
        >
            <div>
                <IconButton
                    onClick={onClick}
                    ref={buttonRef}
                >
                  <MoreVertOutlinedIcon/>
                </IconButton>
            </div>
        </Tooltip>
    );
}