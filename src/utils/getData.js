import db from "../database/db";

const MAX_ACTIONS = 2;

export default async function getData ({chats, contacts: cts, inivitation, userId}, callback) {
    let status = 0;
    const discussions = [];
    const newDiscussions = [];
    const updateDiscussions = [];

    const messages = [];
    const newMessages = [];
    const updateMessages = [];

    const contacts = [];
    const newContacts = [];
    const updateContacts = [];

    chats?.forEach(discussion => {
        const remonteMessages = 
        [...discussion.messages].sort((a, b) =>
            (new Date (a.createdAt)).getTime() - 
            (new Date (b.createdAt)).getTime()
        );
        const members = discussion?.members;
        const target = members?.find(({_id: user}) => user._id !== userId)?._id;
        const type = discussion.type;
        const targetId = type === "direct" ? target?._id : discussion?._id;
        const name = type === "direct" ? 
        `${target?.fname || ''} ${target?.lname || ''} ${target?.mname || ''}`.trim() :
        discussion?.name;
        const avatarSrc = type === 'direct' ? target?.imageUrl : discussion.imageUrl;
        const lastNotice = remonteMessages[remonteMessages.length - 1];
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
        remonteMessages.forEach((message) =>  {
            const id = message.clientId || message._id;
            const sender = message.sender;
            const name = `${sender?.fname || ''} ${sender?.lname || ''} ${sender?.mname || ''}`.trim();
            const localMessages = {
                remonteId: message?._id,
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
        const name = `${contact.fname || ''} ${contact.lname || ''} ${contact.mname || ''}`.trim();
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
    })
    const discussionsIds = discussions.map(({id}) => id);
    const messagesIds = messages.map(({id}) => id);
    const contactsIds = contacts.map(({id}) => id);

    db.discussions.bulkGet(discussionsIds).then(async data => {
        data.forEach((discussion, index) => {
            const remonteDiscussion = discussions[index];
            if(discussion) {
                const localTime = (new Date (discussion.updatedAt)).getTime();
                const remonteTime = (new Date (remonteDiscussion.updatedAt)).getTime();
                if(localTime !== remonteTime)
                    updateDiscussions.push({
                        key: discussion.id,
                        changes: {
                            name: remonteDiscussion.name, 
                            members: remonteDiscussion.members,
                            lastNotice: remonteDiscussion.lastNotice,
                            avatarSrc: remonteDiscussion.avatarSrc,
                            updatedAt: new Date(remonteDiscussion?.updatedAt),
                            lastNoticeType: remonteDiscussion?.lastNoticeType,
                            discription: remonteDiscussion?.discription,
                            origin: remonteDiscussion.origin,
                        }
                    })
            }
            else newDiscussions.push(remonteDiscussion);
        });
        if(newDiscussions.length)
           await db.discussions.bulkAdd(newDiscussions);
        if(updateDiscussions.length)
           await db.discussions.bulkUpdate(updateDiscussions);
        status += 1;
        if(typeof callback === 'function' && MAX_ACTIONS === status)
            callback();
    });
    db.messages.bulkGet(messagesIds).then(async data => {
        data.forEach((message, index) => {
            const remonteMessage = messages[index];
            if(message) {
                const localTime = (new Date (message.updatedAt)).getTime();
                const remonteTime = (new Date (remonteMessage.updatedAt)).getTime();
                if(localTime !== remonteTime)
                    updateMessages.push({
                        key: message.id,
                        changes: {
                            content: remonteMessage?.content,
                            avatarSrc: remonteMessage?.imageUrl,
                            status: remonteMessage?.status,
                            sended: true,
                            updatedAt: remonteMessage.updatedAt || remonteMessage?.createdAt,
                            origin: remonteMessage.origin,
                        }
                    });
            }
            else newMessages.push(remonteMessage);
        });
        let loaded = false;
        if(newMessages.length)
            loaded = Boolean(
                await db.messages.bulkAdd(newMessages)
            );
        if(updateMessages.length)
            loaded = Boolean(
                await db.messages.bulkUpdate(updateMessages)
            );
        status += 1;
        if(typeof callback === 'function' && MAX_ACTIONS === status)
            callback();
    });
    db.contacts.bulkGet(contactsIds).then(async data => {
        data.forEach((contact, index) => {
            const remonteContact = contacts[index];
            if(contact) {
                const localTime = (new Date (contact.updatedAt)).getTime();
                const remonteTime = (new Date (contact.updatedAt)).getTime();
                if(localTime !== remonteTime)
                    updateContacts.push({
                        key: remonteContact.id,
                        changes: { ...remonteContact}
                    })
            }
            else newContacts.push(remonteContact);
        });
        if(newContacts.length)
           await db.contacts.bulkAdd(newContacts);
        if(updateContacts.length)
           await db.contacts.bulkUpdate(updateContacts);
        status += 1;
        if(typeof callback === 'function' && MAX_ACTIONS === status)
            callback();
    });
    
}