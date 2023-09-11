import React, { createContext, useState, useContext, useRef, useCallback, useLayoutEffect } from "react";
import { useData } from "./DataProvider";
import { decrypt } from "./crypt";
import useMediaTracks from "./useMediaTracks";
import { useDispatch } from "react-redux";
import store from '../redux/store';
import { addParticipants, updateParticipantState } from "../redux/conference";
import { setData } from "../redux/meeting";

export default function MeetingProvider ({children}) {
    const [{client}] = useData();
    const contentRootRef = useRef();
    const [meetingData, setMeetingData] = useState(openerData);
    const [openEndMessageType, setOpenEndMessageType] = useState(null);
    const [remoteVideoTracks, settersRemoteVideoTracks] = useMediaTracks({type: 'video'});
    const [remoteAudioTracks, settersRemoteAudioTracks] = useMediaTracks({type: 'audio'});
    const dispatch = useDispatch();
    const ringRef = useRef(null);
    const timerRef = useRef(null);
    const localTrackRef = useRef({videoTrack: null, audioTrack: null});
    const handleUserToggleJoin = useCallback(joined => ({uid}) => {
        const id = getUserIdByUid(uid);
        if(id) {
            const data = {
                ids: [id],
                uid,
                key: 'state',
                state: {isInRoom: joined}
           }
            dispatch(updateParticipantState({data}));
        }
    }, [dispatch]);

    const handleUserTogglePublished = useCallback((published) => async (user, mediaType) => {
        const uid = user.uid;
        const id = getUserIdByUid(uid);
        const setters = ({
            audio: settersRemoteAudioTracks,
            video: settersRemoteVideoTracks
        })[mediaType];
        if(id) {
            let track = null;
            if(published) {
                await client.subscribe(user, mediaType);
                if(mediaType === 'audio') user.audioTrack.play();
                track = user[mediaType + 'Track'];
            }
            setters.toggleTrack({id, uid, track});
        }
    },[settersRemoteAudioTracks, settersRemoteVideoTracks, client]);

    const getters = {
        localTrackRef,
        openEndMessageType,
        remoteVideoTracks,
        remoteAudioTracks,
        contentRootRef,
        ...(meetingData ? {meetingData, ...meetingData}: {}),
        ringRef,
        timerRef,
    };
    
    const setters = {
        setOpenEndMessageType,
        settersRemoteVideoTracks,
        settersRemoteAudioTracks,
        setMeetingData (newData) {
            if(newData) setMeetingData(
                data => ({...data, ...newData})
            );
            else setMeetingData({});
        }
    };

    useLayoutEffect(() => {
        const onUserPublished = handleUserTogglePublished(true);
        const onUserUnpublished = handleUserTogglePublished(false);
        const onUserJoined = handleUserToggleJoin(true);
        const onUserLeft = handleUserToggleJoin(false);
        client.on('user-joined', onUserJoined);
        client.on('user-published', onUserPublished);
        client.on('user-unpublished', onUserUnpublished);
        client.on('user-left', onUserLeft);
        return () => {
            client.off('user-published', onUserPublished);
            client.off('user-unpublished', onUserUnpublished);
            client.off('user-joined',onUserJoined);
            client.off('user-left', onUserLeft);
        }
    }, [client, handleUserTogglePublished, handleUserToggleJoin]);

    useLayoutEffect(() => {
        if(openerData?.origin) {
            const {
                createdAt, 
                location, 
                _id: meetingId, 
                target, 
                participants, 
                callDetails: options
            } = openerData?.origin;
            const id = store.getState().user.id;
            if(participants) {
                store.dispatch(addParticipants({
                    participants:  participants?.map(
                        participant => ({
                            ...participant, 
                            id: participant?.identity._id,
                            state: participant?.identity._id === id ? {
                                ...participant.state,
                                isInRoom: true,
                            }: participant.state,
                        })
                    )
                }));
            }
            store.dispatch(
                setData({
                    data: {options, createdAt, location, meetingId,}
                })
            );

        }
    },[])

    return (
        <MeetingDataContext.Provider value={[getters, setters]}
        >{children}</MeetingDataContext.Provider>
    )
}

export const getUserIdByUid = uid => {
    const user = store.getState().conference.participants.find(participant => participant.uid === uid);
    return user ? user.id : null;
};

export const getUserUidById = id => {
    const user = store.getState().conference.participants.find(participant => participant.id === id);
    return user ? user.uid : null;
};

export const findUser = id => {
    const user = store.getState().conference.participants.find(participant => participant.id === id);
    return user ? user : null;
};


export const openerData = window.geidMeetingData ? decrypt(window.geidMeetingData) : null;
const MeetingDataContext  = createContext(openerData);
export const useMeetingData = () => useContext(MeetingDataContext);
export const bcName = `_geid_call_window_${openerData?.secretCode}`;

if(window.opener && window.location.pathname.indexOf('meeting') !== - 1) {
    if(openerData) {
        const channel = new BroadcastChannel(bcName);
        window.addEventListener('beforeunload', () => {
           channel.postMessage({type: 'mode', mode: 'none'});
        });
    } else window.close()
}