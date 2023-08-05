import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ListItemIcon, ListItemText, MenuItem, Stack } from '@mui/material';
import Menu from '../../../../../components/Menu';
import MicroOption from './MicroOption';
import RaiseHandView from './RaiseHandView';
import MoreOptions from './MoreOptions';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { useMeetingData } from '../../../../../utils/MeetingProvider';

const PushPinOutlined = (props) => {
    return (<PushPinOutlinedIcon {...props} sx={{ transform: 'rotate(45deg)' }}/>);
};

const UnpinOutlined = (props) => {
  return (
    <PushPinOutlined {...props}>
      <rect x="5" y="11" width="14" height="2" />
    </PushPinOutlined>
  );
}

export default function MemberOptions({rootRef, id, name, state}) {
    const [,{settersRemoteAudioTracks}] = useMeetingData();
    const audioTrack = useMemo(() => 
        settersRemoteAudioTracks.getTrackById(id), 
        [settersRemoteAudioTracks, id]
    );
    const anchorElRef = useRef();
    const [anchorEl, setAnchorEl] = useState();

    const handleClose = useCallback(() => {
        setAnchorEl(null)
    },[]);

    const options = [
        {
            label: 'Epingler' || 'Détacher',
            icon : <PushPinOutlined/> || <UnpinOutlined/>
        },
    ];

    return (
        <>
            <Stack
                spacing={1}
                direction="row"
            >
                <RaiseHandView
                    title={`${name} a levé la main`}
                    show={state?.handRaised}
                    id={id}
                />
                <MicroOption
                    active={Boolean(audioTrack)}
                    id={id}
                />
                <MoreOptions
                    buttonRef={anchorElRef}
                    onClick={() => {
                        setAnchorEl(anchorElRef.current);
                    }}
                />
            </Stack>
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
        </>
    );
}
