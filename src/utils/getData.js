import db from "../database/db";
import getBase64Image from "./getBase64Image";
import getFullName from "./getFullName";
import store from "../redux/store";

export default async function getData ({chats, contacts: cts, inivitation, userId, meetings}, callback) {
    const discussions = [];
    const newDiscussions = [];
    const updateDiscussions = [];

    const messages = [];
    const newMessages = [];
    const updateMessages = [];

    const contacts = [];
    const newContacts = [];
    const updateContacts = [];

    const calls = [];
    const newCalls = [];
    const updateCalls = [];

    chats?.forEach(discussion => {
        const remoteMessages = 
        [...discussion.messages].sort((a, b) =>
            (new Date (a.createdAt)).getTime() - 
            (new Date (b.createdAt)).getTime()
        );
        const members = discussion?.members;

        if(members?.find(({_id: user}) => user === null))
            console.log(members);

        const target = members?.find(({_id: user}) => user._id !== userId)?._id;
        
        const type = discussion.type;
        const targetId = type === "direct" ? target?._id : discussion?._id;
        const name = type === "direct" ? getFullName(target) : discussion?.name;
        const avatarSrc = type === 'direct' ? target?.imageUrl : discussion.imageUrl;
        const lastNotice = remoteMessages[remoteMessages.length - 1];
        const localDiscussion = {
            id: targetId, 
            name, 
            members,
            createdBy: discussion.createdBy,
            lastNotice,
            avatarSrc,
            type,
            updatedAt: new Date(discussion?.updatedAt),
            createdAt: new Date(discussion?.createdAt),
            description: discussion.description,
            origin: discussion,
        };
        discussions.push(localDiscussion);
        remoteMessages.forEach((message) =>  {
            const id = message.clientId || message._id;
            const sender = message.sender;
            const name = getFullName(sender);
            const localMessages = {
                remoteId: message?._id,
                id,
                type: message.type,
                targetId,
                content: message?.content,
                avatarSrc: sender?.imageUrl,
                createdAt: message?.createdAt,
                isMine: sender?._id === userId,
                status: message?.status,
                origin: message,
                sended: true,
                timeout: 10000,
                updatedAt: message.updatedAt || message?.createdAt,
                name,
                subType: message.subtype?.toLowerCase(),
            };
            messages.push(localMessages);
        });
        
    });

    cts?.forEach(contact => {
        const name = getFullName(contact);
        const localContact = {
            id: contact?._id,
            name,
            email: contact?.email,
            grade: contact?.grade?.grade,
            role: contact?.grade?.role,
            firstName: contact?.fname,
            lastName: contact?.lname,
            middleName: contact?.mname,
            avatarSrc: contact.imageUrl,
            origin: contact,
            updatedAt: new Date(contact?.updatedAt),
        };
        contacts.push(localContact);
    });

    meetings?.forEach(meeting => {
        calls.push(
            structureCallData({meeting, userId})
        );
    });

    const discussionsIds = discussions.map(({id}) => id);
    const messagesIds = messages.map(({id}) => id);
    const contactsIds = contacts.map(({id}) => id);
    const callsIds = calls.map(({id}) => id);

    const promiseDiscussions = new Promise((resolve, reject) => {
        db?.discussions.bulkGet(discussionsIds).then(async data => {
            data.forEach((discussion, index) => {
                const remoteDiscussion = discussions[index];
                if(discussion) {
                    const localTime = (new Date (discussion.updatedAt)).getTime();
                    const remoteTime = (new Date (remoteDiscussion.updatedAt)).getTime();
                    if(isNaN(localTime) ||  localTime < remoteTime)
                        updateDiscussions.push({
                            key: discussion.id,
                            changes: {
                                name: remoteDiscussion.name, 
                                members: remoteDiscussion.members,
                                lastNotice: remoteDiscussion.lastNotice,
                                avatarSrc: remoteDiscussion.avatarSrc,
                                updatedAt: new Date(remoteDiscussion?.updatedAt),
                                lastNoticeType: remoteDiscussion?.lastNoticeType,
                                description: remoteDiscussion?.description,
                                origin: remoteDiscussion.origin,
                            }
                        })
                }
                else newDiscussions.push(remoteDiscussion);
            });
            try {
                if(newDiscussions.length) 
                    await db?.discussions.bulkAdd(filterByKey(newDiscussions));
                if(updateDiscussions.length)
                    await db?.discussions.bulkUpdate(filterByKey(updateDiscussions, 'key'));
                [...newDiscussions, ...updateDiscussions].forEach((data) => {
                    const avatarSrc = data?.avatarSrc || data?.changes?.avatarSrc;
                    const id = data?.id || data?.key;
                    if(avatarSrc && id)
                        getBase64Image(avatarSrc).then(avatarBuffer => {
                            db?.discussions.update(id, {avatarBuffer});
                        })
                });   
                resolve('update');
            } catch (e) { reject(e); }
        });
    });

    const promiseMessages = new Promise((resolve, reject) => {
        db?.messages.bulkGet(messagesIds).then(async data => {
            data.forEach((message, index) => {
                const remoteMessage = messages[index];
                if(message) {
                    const localTime = (new Date (message.updatedAt)).getTime();
                    const remoteTime = (new Date (remoteMessage.updatedAt)).getTime();
                    if(localTime !== remoteTime)
                        updateMessages.push({
                            key: message.id,
                            changes: {
                                content: remoteMessage?.content,
                                avatarSrc: remoteMessage?.imageUrl,
                                status: remoteMessage?.status,
                                sended: true,
                                updatedAt: remoteMessage.updatedAt || remoteMessage?.createdAt,
                                origin: remoteMessage.origin,
                            }
                        });
                }
                else newMessages.push(remoteMessage);
            });
            try {
                if(newMessages.length)
                    await db?.messages.bulkAdd(filterByKey(newMessages));
                if(updateMessages.length)
                    await db?.messages.bulkUpdate(filterByKey(updateMessages, 'key'));
                [...newMessages, ...updateMessages].forEach((data) => {
                    const avatarSrc = data?.avatarSrc || data?.changes?.avatarSrc;
                    const id = data?.id || data?.key;
                    const isMine = data?.isMine;
                   
                    if(avatarSrc && !isMine && id)
                        getBase64Image(avatarSrc).then(avatarBuffer => {
                            db?.messages.update(id, {avatarBuffer});
                        })
                });    
                resolve('update');
            } catch (e) { reject(e); }
        });
    });

    const promiseContacts = new Promise((resolve, reject) => {
        db?.contacts.bulkGet(contactsIds).then(async data => {
            data.forEach((contact, index) => {
                const remoteContact = contacts[index];
                if(contact) {
                    const localTime = (new Date (contact.updatedAt)).getTime();
                    const remoteTime = (new Date (contact.updatedAt)).getTime();
                    if(localTime !== remoteTime)
                        updateContacts.push({
                            key: remoteContact.id,
                            changes: { ...remoteContact}
                        })
                }
                else newContacts.push(remoteContact);
            });
            try {
                if(newContacts.length)
                    await db?.contacts.bulkAdd(filterByKey(newContacts));
                if(updateContacts.length)
                    await db?.contacts.bulkUpdate(filterByKey(updateContacts, 'key'));
                [...newContacts, ...updateContacts].forEach((data) => {
                    const avatarSrc = data?.avatarSrc || data?.changes?.avatarSrc;
                    const id = data?.id || data?.key;

                    if(avatarSrc && id)
                        getBase64Image(avatarSrc).then(avatarBuffer => {
                            db?.contacts.update(id, {avatarBuffer});
                        })
                });   
                resolve('update');
            } catch (e) { reject(e); }
        });
    });
    
    db?.calls.bulkGet(callsIds).then(async data => {
        data.forEach((call, index) => {
            const remoteCall = calls[index];
            if(call) {
                const localTime = (new Date (call.updatedAt)).getTime();
                const remoteTime = (new Date (remoteCall.updatedAt)).getTime();
                const changes = structureCallData({meeting: remoteCall, userId, isUpdate: true});
                if(localTime !== remoteTime)
                    updateCalls.push({
                        key: remoteCall.id,
                        changes,
                    })
            }
            else newCalls.push(remoteCall);
        });
        try {
            if(newCalls.length)
                await db?.calls.bulkAdd(filterByKey(newCalls));
            if(updateCalls.length) 
                await db?.calls.bulkUpdate(filterByKey(updateCalls, 'key'));
            [...newCalls, ...updateCalls].forEach((data) => {
                const avatarSrc = data?.avatarSrc || data?.changes?.avatarSrc;
                const id = data?.id || data?.key;
                if(avatarSrc && id)
                    getBase64Image(avatarSrc).then(avatarBuffer => {
                        db?.calls.update(id, {avatarBuffer});
                    })
            });   
            
        } catch (e) { }
    });

    Promise.all([promiseDiscussions, promiseMessages, promiseContacts]).then(() => {
        if(typeof callback === 'function') callback();
    });
}

function filterByKey(arr, key = 'id') {
    const result = [];
    arr.forEach(obj => {
        const isNotExist = !result?.find( _obj => obj[key] === _obj[key]);
      if (isNotExist) result.push(obj);
    });
    return result;
  }
  

function structureCallData ({meeting, userId, isUpdate = false}) {
    const name = meeting?.room?.name;
    const avatarSrc = meeting?.room?.imageUrl;
    const id = userId || store?.getState()?.user?.id;
    const data =  {
        ...isUpdate ? {} : {
            id: meeting?._id,
            title: meeting?.title,
            description: meeting?.description,
            duration: meeting?.duration,
            isMine: id === meeting?.createdBy?._id,
            options: meeting?.callDetails,
            location: meeting?.location,
            createdAt: new Date(meeting?.createdAt),
            createdBy: meeting?.createdBy,
            startedAt: meeting?.start,
            name,
        },
        members: meeting?.participants || meeting.members,
        avatarSrc,
        status: meeting?.status,
        origin: meeting?.origin || meeting,
        updatedAt: new Date(meeting?.updatedAt),
    };
    Object.keys(data).forEach(key => {
        if(data[key] === undefined)
            delete data[key];
    })
    return data;
}
