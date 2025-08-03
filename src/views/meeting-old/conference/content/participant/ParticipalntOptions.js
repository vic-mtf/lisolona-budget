import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import Menu from '../../../../../components/Menu';
import { useMemo } from "react";
import optionsData from "./optionsData";
import { useSelector } from "react-redux";


export default function ParticipantOptions({id, anchorEl, handleClose}) {
    const pinId = useSelector(store => store.conference.pinId);
    const pined = useMemo(() => id === pinId, [pinId, id]);

    const options = useMemo(() => 
        optionsData({
            id, pined
        }), [id, pined])

    return (
        <Menu
            anchorEl={anchorEl} 
            keepMounted 
            open={Boolean(anchorEl)} 
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            {options.map(({label, icon, onClick, disabled}) => (
                <MenuItem key={label} onClick={onClick} disabled={disabled}>
                    {!!icon && <ListItemIcon>
                        {icon}
                    </ListItemIcon>}
                    <ListItemText
                        primary={label}
                    />
                </MenuItem>
            ))}
        </Menu>
    )
}