import store from '../redux/store';
import filterByKey from '../utils/filterByKey';
import { getTime } from '../utils/formatTime';
import db from './db';

export default function structureMeetingData ({meeting, userId, isUpdate = false}) {
    const name = meeting?.room?.name;
    const avatarSrc = meeting?.room?.imageUrl;
    const id = userId || store?.getState()?.user?.id;
    const data =  {
        members: meeting?.participants || meeting?.members,
        avatarSrc,
        status: meeting?.status,
        origin: meeting?.origin || meeting,
        updatedAt: new Date(meeting?.updatedAt),
        ...isUpdate ? {} : {
            id: meeting?._id,
            title: meeting?.title,
            description: meeting?.description,
            duration: meeting?.duration,
            isMine: id === meeting?.createdBy?._id,
            options: meeting?.meetingDetails,
            location: meeting?.location,
            createdAt: new Date(meeting?.createdAt),
            createdBy: meeting?.createdBy,
            startedAt: meeting?.start,
            name,
        }
    };
    Object.keys(data).forEach(key => {
        if(data[key] === undefined) delete data[key];
    });
    return data;
};

export async function setMeetingData (meetings=[]) {
    const newMeetings = [];
    const updateMeetings= [];
    const meetingsIds = meetings?.map(meeting => structureMeetingData({meeting})?.id); 
    const data = await db?.calls.bulkGet(meetingsIds);
    data.forEach((meeting, index) => {
        const remoteMeeting = meetings[index];
        if(meeting) {
            const localTime = getTime(meeting.updatedAt);
            const remoteTime = getTime(remoteMeeting.updatedAt);
            if(localTime !== remoteTime)
                updateMeetings.push({
                    key: remoteMeeting.id,
                    changes: structureMeetingData({
                        meeting: remoteMeeting, 
                        isUpdate: true
                    }),
                })
        }
        else newMeetings.push(structureMeetingData({
            meeting: remoteMeeting, 
        }));
    });
    if(newMeetings.length)
        await db?.calls?.bulkAdd(filterByKey(newMeetings));
    if(updateMeetings.length) 
        await db?.calls?.bulkUpdate(filterByKey('key', updateMeetings));
    return 'update';
}