import {
    Box as MuiBox
} from '@mui/material';
import { LoadingButton } from "@mui/lab";
import { useMeetingData } from '../../../utils/MeetingProvider';
import { useCallback, useMemo, useState } from 'react';
import useAxios from '../../../utils/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { setCameraData, setData, setMicroData } from '../../../redux/meeting';
import { useData } from '../../../utils/DataProvider';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useSocket } from '../../../utils/SocketIOProvider';
import store from '../../../redux/store';

export default function Footer () {
    const [{videoStreamRef, audioStreamRef}] = useData();
    const [{meetingData, localTrackRef}, {settersMembers}] = useMeetingData();
    const [{client}] = useData();
    const socket = useSocket();
    const state =  meetingData.defaultCallingState;
    const [loading, setLoading] = useState(false);
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();
    const [,refetch] = useAxios({
        url: '/api/chat/room/call/',
        headers: {Authorization: `Bearer ${user?.token}`},
    }, {manual: true});
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target]);

    const onPublish = useCallback(async () => {
        const micro = store.getState().meeting.micro;
        const camera = store.getState().meeting.camera;
        const streams = [];
        const localAudioTrack = localTrackRef.current.audioTrack;
        const localVideoTrack = localTrackRef.current.videoTrack;
        if(micro.active && audioStreamRef.current && !micro.published && localAudioTrack) 
            streams.push(localAudioTrack);
        if(camera.active && videoStreamRef.current && !camera.published && localVideoTrack)
            streams.push(localVideoTrack);
        if(streams.length) {
            await client.publish(streams);
            if(localAudioTrack)
                dispatch(setMicroData({data: { published: true }}));
            if(localVideoTrack)
                dispatch(setCameraData({data: { published: true }}));
        }
    }, [audioStreamRef, client, dispatch, localTrackRef, videoStreamRef]);

    const onJoin = useCallback(data => {
        const { 
            callDetails: options,
            createdAt,
            location,
            participants: members,
            _id: meetingId
        } = data;
        settersMembers.addObjects(members.map(
            member => ({...member, id: member.identity._id,})
        ));
        const uid = settersMembers.getObjectIndexById(user?.id) + 1;
        if(uid) {
            return new Promise((resolve, reject) => {
                client.join(options.APP_ID, location, options.TOKEN, uid).then(async () => {
                    const stream = [];
                    dispatch(setData({data: {
                        options, 
                        createdAt, 
                        location, 
                        mode: 'on',
                        joined: true,
                        meetingId,
                    }}));
                    if(videoStreamRef.current) {
                        const [mediaStreamTrack] = videoStreamRef.current.getVideoTracks();
                        localTrackRef.current.videoTrack = AgoraRTC.createCustomVideoTrack({
                            mediaStreamTrack
                        });
                        stream.push(localTrackRef.current.audioTrack);
                    }
                    if(audioStreamRef.current) {
                        const [mediaStreamTrack] = audioStreamRef.current.getAudioTracks();
                        localTrackRef.current.audioTrack = AgoraRTC.createCustomAudioTrack({
                            mediaStreamTrack
                        });
                        stream.push(localTrackRef.current.audioTrack);
                    }
                    resolve(data);
                }).catch((err) => { reject(err) });
            })
        }
    }, [audioStreamRef, client, localTrackRef, dispatch, settersMembers, videoStreamRef, user]);

    const handleCreateMeeting = () => {
        setLoading(true);
        refetch({
            method: 'post',
            data: {
                target: target?.id,
                type: target?.type,
                tokenType: 'uid',
                role: 'publisher',
                start: Date.now(),
            }
        }).then(({data}) => {
            onJoin(data).then(() => {
                setLoading(false);
            })
        }).catch(() => {
            setLoading(false);
        });
    };

    const handleJoinMeeting = async() => {
        setLoading(true);
        socket.emit('join', { id: meetingData.origin?._id });
        await onJoin(meetingData.origin);
        onPublish();
        setLoading(false);
    };

    return (
        <MuiBox>
            <LoadingButton 
                variant="contained" 
                color="primary"
                loading={loading}
                onClick={async () => {
                    if(state === 'before') 
                        handleCreateMeeting();
                    else handleJoinMeeting();
                }}
                sx={{
                    textTransform: 'none',
                }}
            >
                {state === 'before' ? 'Commencer la réunion' : 'Participer à la réunion'} 
            </LoadingButton>
        </MuiBox>
    )
}