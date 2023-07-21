import React, { useMemo, useRef, useState } from 'react';
import { 
    MenuItem,
    Toolbar, 
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import db from '../../../../database/db';
import { useLiveQuery } from 'dexie-react-hooks';
import Button from '../../../../components/Button';
import AddIcCallOutlinedIcon from '@mui/icons-material/AddIcCallOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import CastRoundedIcon from '@mui/icons-material/CastRounded';
import { useSocket } from '../../../../utils/SocketIOProvider';
import { useData } from '../../../../utils/DataProvider';
import Menu from '../../../../components/Menu';
import { addData } from '../../../../redux/data';
import { escapeRegExp } from 'lodash';

export default function CallContactsList ({search, navigation}) {
    const mode = useSelector(store => store.meeting?.mode);
    const socket = useSocket();
    const dispatch = useDispatch();
    const disabled = useMemo(() => mode !==  'none', [mode]);
    const [{secretCodeRef}] = useData();
    const [anchorEl, setAnchorEl] = useState(null);
    const anchorElRef = useRef();

    // const handleOpenMeeting = mode => {
    //     const wd = openNewWindow({
    //         url: '/meeting/',
    //     });
    //     wd.geidMeetingData = encrypt({
    //         target,
    //         mode,
    //         secretCode: secretCodeRef.current,
    //         defaultCallingState: 'before',
    //     });
    //     if(wd) {
    //         dispatch(setData({ data: {mode}}));
    //         wd.openerSocket = socket;
    //     }
    // }

    const calls = useLiveQuery(() => 
    db?.discussions.filter(({name}) =>
         new RegExp(escapeRegExp (search.trim().split(/\s/).join('|')), 'ig').test(name)
     )
     .toArray()
 ,[search]);

    const menuItems = [
    {
        Icon: MeetingRoomOutlinedIcon,
        label: 'Rejoindre une reunion en cours',
        onClick() {
            dispatch(addData({
                key: 'dialog',
                data: 'join-meeting-by-code'
            }))
        }
    },
    {
        Icon: Groups3OutlinedIcon,
        label: 'Démarrer une réunion instantanée',
        onClick () {
            // setAnchorEl(null);
            // handleOpenMeeting('prepare');
        }
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
    
    return (navigation === 1 &&
        <React.Fragment>
            <Toolbar variant="dense">
                <Button
                    children="Lancer un nouvel appel" 
                    variant="outlined"
                    color="inherit"
                    sx={{mx: 'auto'}}
                    ref={anchorElRef}
                    startIcon={<AddIcCallOutlinedIcon/>}
                    endIcon={<ExpandMoreOutlinedIcon/>}
                    onClick={() => {
                        setAnchorEl(anchorElRef.current);
                    }}
                />
            </Toolbar>
            {/* <ListItems
                discussions={discussions}
                search={search}
            />   */}
            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                sx={{
                    '& .MuiMenuItem-root': {
                        '& .MuiSvgIcon-root': {
                        fontSize: 18,
                        color: theme => theme.palette.text.secondary,
                        marginRight: theme => theme.spacing(1.5),
                        },
                    }
                }}
            >
                {menuItems.map(({label, Icon, disabled, onClick}, key) => (
                    <MenuItem
                        key={key}
                        disabled={disabled}
                        onClick={event => {
                            setAnchorEl(null);
                            onClick(event);
                        }}
                    > 
                    {<Icon fontSize="small"/>} {label}
                    </MenuItem>
                )) }
            </Menu>
        </React.Fragment>
    );
}