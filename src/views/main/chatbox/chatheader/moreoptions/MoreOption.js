import React, { useRef, useState } from 'react';
import { 
    CardContent, ListItemIcon, ListItemText, MenuItem, ThemeProvider, Tooltip, 
} from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import Menu from '../../../../../components/Menu';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import options from './options';

export default function MoreOption ({theme}) {
    const anchorElRef = useRef();
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
                    // transformOrigin={{
                    //     vertical: 'top',
                    //     horizontal: 'letf',
                    // }}
                >
                    {options().map(({label, icon, onClick}) => (
                        <MenuItem key={label} onClick={onClick}>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
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