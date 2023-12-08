import store from '../redux/store';
import getFullName from '../utils/getFullName';
import db from './db';
import { getTime } from '../utils/formatTime';
import filterByKey from '../utils/filterByKey';
import { getMessages } from './structureMessageData';

export default function structureDiscussionData ({
    discussion, 
    userId = store.getState().user.id,
    isUpdate = false
}) {
    const message = [].concat(discussion.messages).sort(
        (a, b) => getTime(a.createdAt) - getTime(b.createdAt),
    );
    const members = discussion?.members;
    const target = members?.find(({_id: user}) => user._id !== userId)?._id;
    const type = discussion.type;
    const targetId = type === 'direct' ? target?._id : discussion?._id;
    const name = type === 'direct' ? getFullName(target) : discussion?.name;
    const avatarSrc = type === 'direct' ? target?.imageUrl : discussion?.imageUrl;
    const [lastNotice] = message.slice(-1);
    const data = {
        name,
        members,
        lastNotice,
        avatarSrc,
        updatedAt: new Date(discussion?.updatedAt),
        lastNoticeType: discussion?.lastNoticeType,
        description: discussion?.description,
        origin: discussion?.origin || discussion,
        ...isUpdate ? {}:
        { 
            id: targetId, 
            members,
            createdBy: discussion.createdBy,
            type,
            createdAt: new Date(discussion?.createdAt),
        },
    };
    Object.keys(data).forEach(key => {
        if(data[key] === undefined) delete data[key];
    });
    return data;
};

export async function setDiscussion (discussions) {
    const discussionsIds = discussions.map(discussion => structureDiscussionData({discussion})?.id); 
    const newDiscussions = [];
    const updateDiscussions = [];
    const newMessages = [];
    const updateMessages = [];
    const data = await db?.discussions?.bulkGet(discussionsIds);
    data.forEach(async (discussion, index) => {
        const remoteDiscussion = discussions[index];
        if(discussion) {
            const localTime = getTime(discussion?.updatedAt);
            const remoteTime = getTime(remoteDiscussion?.updatedAt);
            if(localTime !== remoteTime)
                updateDiscussions.push({
                    key: discussion.id,
                    changes: structureDiscussionData({
                        discussion: remoteDiscussion,
                        isUpdate: true,
                    }),
                })
        }
        else newDiscussions.push(structureDiscussionData({
            discussion: remoteDiscussion,
        }));
        const { 
            newMessages: _newMessages, 
            updateMessages: _updateMessages 
        } = await getMessages(remoteDiscussion?.messages, remoteDiscussion);
        newMessages.push(..._newMessages);
        updateMessages.push(..._updateMessages);
    });
    if(newDiscussions.length) 
        await db?.discussions.bulkAdd(filterByKey(newDiscussions));
    if(updateDiscussions.length)
        await db?.discussions.bulkUpdate(filterByKey('key', updateDiscussions));
    if(newMessages.length)
        await db?.messages.bulkAdd(filterByKey(newMessages));
    if(updateMessages.length)
        await db?.messages.bulkUpdate(filterByKey('key', updateMessages));
    return 'update';
}