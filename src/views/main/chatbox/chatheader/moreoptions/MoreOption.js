import React, { useRef, useState } from 'react';
import { 
    CardContent, ListItemIcon, ListItemText, MenuItem, ThemeProvider, Tooltip, 
} from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import Menu from '../../../../../components/Menu';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import options from './options';
import { useSelector } from 'react-redux';

export default function MoreOption ({theme}) {
    const anchorElRef = useRef();
    const constact = useSelector(store => {
        const { chatId, contacts, conversations } = store.data;
        const contact = conversations?.find(({id}) => id === chatId) || 
            contacts?.find(({id}) => id === chatId);
        return {
            ...contact, 
            members: contact?.origin?.members?.map(
                ({_id: user, role}) => store.user?.id !== user?._id && ({
                    ...user,
                    role,
                    id: user?._id,
                    origin: user,
                    name: `${user?.fname || ''} ${ user?.lname || ''} ${user?.mname || ''}`.trim(),
                })
            )?.filter(name => name),
        };
    });

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false)
    };

    return (
        <React.Fragment>
            <Tooltip title="Plus d'options" arrow>
                <IconButton 
                    sx={{mx: 1}} 
                    ref={anchorElRef}
                    onClick={() => setOpen(true)}
                >
                    <MoreVertOutlinedIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
            <ThemeProvider theme={theme}>
                <Menu
                    anchorEl={anchorElRef.current} 
                    keepMounted 
                    open={open} 
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    {options(constact, handleClose).map(({label, icon, onClick}) => (
                        <MenuItem key={label} onClick={onClick}>
                            {!!icon && <ListItemIcon>
                                {icon}
                            </ListItemIcon>}
                            <ListItemText
                                primary={label}
                            />
                        </MenuItem>
                    ))}
                </Menu>
            </ThemeProvider>
        </React.Fragment>
    );
}