import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Stack, Tooltip, Zoom } from '@mui/material';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import MicroOption from './MicroOption';
import PinOption from './PinOption';
import RaiseHandView from './RaiseHandView';
import { useMeetingData } from '../../../../../utils/MeetingProvider';
import AdminView from './AdminView';
import { useData } from '../../../../../utils/DataProvider';


export default function MemberOptions({rootRef, id, state, name}) {
    const socket = useSocket();
    const [{client}] = useData();
    const [{membersRef}, {settersRemoteTracks, settersMembers}] = useMeetingData();
    const uid = useMemo(() => settersMembers.getObjectIndexById(id)  + 1, [id, settersMembers]);
    //const [isLoading, setIsLoading] = useState(false);
    //const [screenShared, setScreenShared] = useState(state?.screenShared);
    const [isOrganizer, setIsOrganizer] = useState(state?.isOrganizer);
    const [handRaised, setHandRaised] = useState(state?.handRaised);
    const [microActive, setMicroActive] = useState(
      Boolean(settersRemoteTracks.getObjectById(uid)?.audioTrack)
    );
    
    const handleUserPublished = useCallback(state => (user, mediaType) => {
        if(mediaType === 'audio' && user.uid === uid) 
            setMicroActive(state);
    },[uid]);

      /* 
      state : {
        handRaised
        isInRoom
        isOrganizer
        screenShared
    }  
    dentity : {
        email
        fname
        grade
        {grade, role}
        imageUrl
        lname
        mname
        _id   
    }
    auth: {shareScreen: false}
    */

    useLayoutEffect(() => {
        client.on('user-published', handleUserPublished(true));
        client.on('user-unpublished', handleUserPublished(false));
        return () => {
            client.off('user-published', handleUserPublished(true));
            client.off('user-unpublished', handleUserPublished(false));
        }
    }, [handleUserPublished, client]);

    return (
        <Stack
            spacing={1}
            direction="row"
        >
            {/* <AdminView
                show={isOrganizer}
                title="Modérateur de la réunion"
            /> */}
            <RaiseHandView
                title={`${name} a levé la main`}
                show={handRaised}
            />
            {/* <PinOption
                rootRef={rootRef}
            /> */}
            <MicroOption
                active={microActive}
            />
        </Stack>
    );
}