import React, { createContext, useState, useContext, useLayoutEffect, useRef, useCallback } from "react";
import { useData } from "./DataProvider";
import { useEffect } from "react";
import useTable from "./useTable";
import { decrypt } from "./crypt";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../redux/meeting";
import useTableRef from "./useTableRef";


export default function MeetingProvider ({children}) {
    const [{client}] = useData();
    const joined = useSelector(store => store.meeting.joined);
    const options = useSelector(store => store.meeting.options);
    const CHANNEL = useSelector(store => store.meeting.location);
    const mode = useSelector(store => store.meeting.mode);
    const user = useSelector(store => store.meeting.me);
    const [meetingData, setMeetingData] = useState(data);
    const [membersRef, settersMembers] = useTableRef();
    const [remoteTracks, settersRemoteTracks] = useTableRef();
    const [fictitiousMembers, settersFictitiousMembers] = useTableRef();
    const [participants, settersParticipants] = useTable();
    const [openEndMessageType, setOpenEndMessageType] = useState(null);
    const isChangeModeRef = useRef(true);
    const ringRef = useRef(null);
    const timerRef = useRef(null);
    const localTrackRef = useRef({
        videoTrack: null,
        audioTrack: null
    });

    const dispatch = useDispatch();

    const handleUserJoin = useCallback(user => {
        const { uid } = user;
        const index = uid - 1;
        const target = membersRef.current[index]?.identity;
        const find = settersParticipants.getObjectById(target?._id);
        console.log(meetingData.mode, find, index, target);
        if(target && !find) {
            settersParticipants.updateObject({
                uid,
                id: target?._id,
                name: `${target?.fname} ${target?.lname || ''} ${target?.mname || ''}`,
                email: target?.email,
                avatarSrc: target?.imageUrl,
            })
        }
        if(!target && !find)
            settersFictitiousMembers.updateObject({id: uid, uid});
    },[membersRef, settersFictitiousMembers, settersParticipants, meetingData]);

    const handleUserLeft = useCallback(user => {
        const { uid } = user;
        const [target] = settersParticipants.getTableSubsetByFilter(
            participant => participant.uid === uid
        );
        if(target) { 
            settersParticipants.deleteObject(target.id);
            //settersMembers.deleteObject(target.id);
            //messages
        }
        else {
            //settersFictitiousMembers.deleteObject(uid);
            //messages
        }
        settersRemoteTracks.deleteObject(uid);
    }, [
        //settersFictitiousMembers, 
        settersParticipants,
        settersRemoteTracks
    ]);

    const handleUserPublished = useCallback(async (user, mediaType) => {
        const uid = user.uid;
        handleUserJoin(user);
        await client.subscribe(user, mediaType);
        const key = mediaType + 'Track';
        const value = user[key];
        const data = { uid, [key]: value, id: uid };
        settersRemoteTracks.updateObject(data);
        if(mediaType === 'audio')
            value.play();
        const root = document.getElementById("root");
        const name = '__state-track-change';
        const customEvent = new CustomEvent(name, {
            name,
            detail: {
                user: data,
                trackType: key
            }
        });
        root.dispatchEvent(customEvent);
    },[settersRemoteTracks, client, handleUserJoin]);

    const handleUserUnPublished = useCallback((user, mediaType) => {
        const uid = user.uid;
        const key = mediaType + 'Track';
        const data = { uid, [key]: null, id: uid };
        settersRemoteTracks.updateObject(data);
        const root = document.getElementById("root");
        const name = '__state-track-change';
        const customEvent = new CustomEvent(name, {
            name,
            detail: {
                user: data,
                trackType: key
            }
        });
        root.dispatchEvent(customEvent);
    }, [settersRemoteTracks]);

    const getters = {
        localTrackRef,
        remoteTracks,
        fictitiousMembers,
        openEndMessageType,
        membersRef,
        participants,
        meetingData,
        ringRef,
        timerRef
    };
    
    const setters = {
        settersMembers,
        settersParticipants,
        settersRemoteTracks,
        setOpenEndMessageType,
        setMeetingData (newData) {
            if(newData) setMeetingData(
                data => ({...data, ...newData})
            );
            else setMeetingData({});
        }
    };

    useLayoutEffect(() => {
        if(meetingData && mode === 'none' && isChangeModeRef.current) {
            isChangeModeRef.current = false;
            const { mode, origin } = meetingData;
            const { 
                callDetails: options,
                createdAt,
                location,
                participants: members,
                _id: id
            } = origin || {};
            const data = origin ? { id, options, createdAt, location } : {};
            dispatch(setData({ data: {mode, ...data}}));
            if(members) {
                settersMembers.addObjects(
                    members.map(
                        member => ({...member, id: member.identity._id,})
                    )
                );
            }
        }
    },[dispatch, meetingData, settersMembers, mode]);


    useEffect(() => {
        client.on('user-joined', handleUserJoin);
        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnPublished);
        client.on('user-left', handleUserLeft);
        return () => {
            client.off('user-joined', handleUserJoin);
            client.off('user-published', handleUserPublished);
            client.off('user-unpublished', handleUserUnPublished);
            client.off('user-left', handleUserLeft);
        }
    }, [client, handleUserJoin, handleUserPublished, handleUserUnPublished, handleUserLeft]);

    useLayoutEffect(() => {
        const uid = settersMembers.getObjectIndexById(user?.id) + 1;
        const isDirectCall = meetingData?.target?.type !== 'room';
        if(options && !joined && CHANNEL && uid && isDirectCall) 
            client.join(options.APP_ID, CHANNEL, options.TOKEN, uid)
            .then(() => { dispatch(setData({data: {joined: true}})) });
    }, [options, joined, client, user, CHANNEL, dispatch, settersMembers, meetingData]);

    return (
        <MeetingDataContext.Provider 
            value={[getters, setters]}
        >
          {children}
          
        </MeetingDataContext.Provider>
    )
}

const MeetingDataContext  = createContext();
export const useMeetingData = () => useContext(MeetingDataContext);

const data = window.geidMeetingData ? decrypt(window.geidMeetingData) : null;

if(window.opener && window.location.pathname.indexOf('meeting') !== - 1) {
    if(!data)
        window.close();
    else {
        const channel = new BroadcastChannel(`_geid_call_window_${data.secretCode}`);
        window.addEventListener('beforeunload', () => {
           channel.postMessage({type: 'mode', mode: 'none'});
        });
    }
}

