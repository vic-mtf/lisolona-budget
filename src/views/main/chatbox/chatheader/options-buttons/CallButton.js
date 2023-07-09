
import { MenuItem, ThemeProvider, Tooltip } from '@mui/material';
import IconButton from '../../../../../components/IconButton';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import CastRoundedIcon from '@mui/icons-material/CastRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo } from 'react';
import Menu from '../../../../../components/Menu';
import { useState } from 'react';
import { useRef } from 'react';
import openNewWindow from "../../../../../utils/openNewWindow";
import { encrypt } from "../../../../../utils/crypt";
import { useData } from '../../../../../utils/DataProvider';
import { setData } from '../../../../../redux/meeting';

export default function CallButton  ({target, theme}) {
    const mode = useSelector(store => store.meeting?.mode);
    const dispatch = useDispatch();
    const disabled = useMemo(() => mode !==  'none', [mode]);
    const [{secretCodeRef}] = useData();
    const [anchorEl, setAnchorEl] = useState(null);
    const anchorElRef = useRef();

    const handleOpenMeeting = () => {
        const wd = openNewWindow({
            url: '/meeting/',
        });
        const mode = 'outgoing';
        wd.geidMeetingData = encrypt({
            target,
            mode,
            secretCode: secretCodeRef.current,
            defaultCallingState: 'before',
        });
        if(wd) {
            dispatch(setData({ data: {mode}}))
        }
    }
    const onOpen = () => {
        setAnchorEl(anchorElRef.current);
    };

    const menuItems = [
        {
            Icon: Groups3OutlinedIcon,
            label: 'Démarrer une réunion instantanée',
        },
        {
            Icon: HistoryToggleOffRoundedIcon,
            label: 'Planifier une réunion',
            disabled: true,
        },
        {
            Icon: CastRoundedIcon,
            label: 'Diffusion vidéo en direct',
            disabled: true,
        }
    ];

    return (
        <React.Fragment>
            <Tooltip title={disabled ? "Un appel en cours..." : "Lancer l'appel"} 
                arrow
            >
                <div>
                    <IconButton 
                        sx={{mx: 1}} 
                        disabled={disabled}
                        ref={anchorElRef}
                        onClick={() => target?.type === 'room' ? onOpen() : handleOpenMeeting()}
                    >  
                            <LocalPhoneOutlinedIcon fontSize="small"/>
                            {target?.type === "room" && <ExpandMoreIcon fontSize="small"/>}
                    </IconButton>
                </div>
            </Tooltip>
            <ThemeProvider theme={theme}>
                <Menu
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    sx={{
                        '& .MuiMenuItem-root': {
                            '& .MuiSvgIcon-root': {
                            fontSize: 18,
                            color: theme.palette.text.secondary,
                            marginRight: theme.spacing(1.5),
                            },
                        }
                    }}
                >
                    {menuItems.map(({label, Icon, disabled}, key) => (
                        <MenuItem 
                            key={key}
                            disabled={disabled}
                        > 
                        {<Icon fontSize="small"/>} {label}
                        </MenuItem>
                    )) }
                </Menu>
            </ThemeProvider>
        </React.Fragment>
    )
}