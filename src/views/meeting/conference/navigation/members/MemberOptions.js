import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ListItemIcon, ListItemText, MenuItem, Stack } from '@mui/material';
import Menu from '../../../../../components/Menu';
import MicroOption from './MicroOption';
import RaiseHandView from './RaiseHandView';
import MoreOptions from './MoreOptions';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import store from '../../../../../redux/store';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import useMicroProps from '../../footer/buttons/useMicroProps';
import useCameraProps from '../../footer/buttons/useCameraProps';
import { setConferenceData } from '../../../../../redux/conference';
import useClientState from '../../actions/useClientState';
import { useSelector } from 'react-redux';

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
    const [,{
        settersRemoteAudioTracks,
        settersRemoteVideoTracks
    }] = useMeetingData();
    const microProps = useMicroProps();
    const cameraProps = useCameraProps();
    const socket = useSocket();
    const me = useSelector(store => store.meeting.me);
    const { isOrganizer } = useClientState({id: me?.id, props: [], key: 'state'});
    
    const tracks = useMemo(() => 
        [   settersRemoteVideoTracks.getTrackById(id),
            settersRemoteAudioTracks.getTrackById(id)
        ], 
        [settersRemoteAudioTracks, settersRemoteVideoTracks, id]
    );
    const anchorElRef = useRef();
    const [anchorEl, setAnchorEl] = useState();

    const handleClose = useCallback(() => {
        setAnchorEl(null)
    },[]);

    const options = useMemo(() => {
        const states = {
            ...state,
            microProps,
            cameraProps,
            tracks,
            id,
        };
        let data = publicOptions(states, socket);
        if(isOrganizer)
            data = data.concat(adminOptions(states, socket));
        return data;
    },[state, id, socket, isOrganizer,tracks, cameraProps, microProps]);

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
                    active={Boolean(tracks[1])}
                    id={id}
                />
                {options.length > 0 &&
                <MoreOptions
                    buttonRef={anchorElRef}
                    onClick={() => {
                        setAnchorEl(anchorElRef.current);
                    }}
                />
                }
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
                    <MenuItem 
                        key={label} 
                        onClick={() => {
                            if(typeof onClick === 'function') onClick();
                            if(typeof handleClose === 'function') handleClose();
                        }} 
                        disabled={disabled}>
                        {Boolean(icon) && <ListItemIcon>{icon}</ListItemIcon>}
                        <ListItemText
                            primary={label}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

const publicOptions = (state) => [];

const adminOptions = (state, socket) => {
    const meeting = store.getState().meeting;
    const meetingId = meeting.meetingId;
    const user = meeting.me;
    const createdBy = meeting.createdBy;
    const isMine = user.id === state.id;
    const { handleToggleMicro, loading: loadingMic, micro } = state?.microProps || {};
    const { handlerToggleCamera, loadingCam, camera } = state.cameraProps  || {};
    const [videoTrack, audioTrack] = state.tracks || [];
    const isMic = audioTrack || micro?.active;
    const isCam = videoTrack || camera?.active;

    return (
        [
            {
                label: isMic ? 
                'Désactiver le micro' : 'Activer le micro',
                disabled: isMine ? loadingMic : !isMic && !isMine,
                icon: isMic ? 
                <KeyboardVoiceOutlinedIcon fontSize='small' /> :
                <MicOffOutlinedIcon fontSize='small' />,
                onClick() {
                    if(isMine) 
                        handleToggleMicro()
                    else {
                        socket.emit('signal', {
                            id: meetingId,
                            type: 'state',
                            obj: { isMic: !isMic },
                            who: [state.id],
                        });
                    }
                },
            },
            {
                label: isCam ? 
                'Désactiver la caméra' : 'Activer la caméra',
                disabled: isMine ? loadingCam : !state?.videoTrack && user?.id !== state?.id,
                icon: isCam ? 
                <VideocamOutlinedIcon fontSize='small' />:
                <VideocamOffOutlinedIcon fontSize='small' />,
                onClick() {
                    if(isMine) 
                        handlerToggleCamera()
                    else {
                        socket.emit('signal', {
                            id: meetingId,
                            type: 'state',
                            obj: {isCame: !isCam},
                            who: [state.id],
                        });
                    }
                },
            },
            {
                label: state?.isOrganizer ? 
                'Retirer comme modérateur': 'Désigner comme modérateur',
                disabled: createdBy?._id === state?.id || isMine,
                icon: state?.videoTrack ? 
                <PersonOffOutlinedIcon fontSize='small' /> :
                <SupervisorAccountOutlinedIcon fontSize='small' />,
                onClick() {
                    socket.emit('signal', {
                        id: meetingId,
                        type: 'state',
                        obj: {isOrganizer: !state?.isOrganizer},
                        who: [state.id],
                    });
                },
            },
            {
                label: 'Bannir de la réunion',
                disabled: createdBy?._id === state?.id || createdBy === undefined,
                icon: <RemoveCircleOutlineOutlinedIcon fontSize='small' />,
            },
            {
                label: 'les autorisations du participant',
                icon: <SettingsOutlinedIcon fontSize='small' />,
                onClick() {
                    console.log('Bannir de la réunion')
                    store.dispatch(
                        setConferenceData({
                            data: {
                                moderatorOptions: {
                                    auth: { 
                                        open: true,
                                        id: state?.id,
                                    }
                                },
                            }
                        })
                    )
                },
            }
        ]
    );
}