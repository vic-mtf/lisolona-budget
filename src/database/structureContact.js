import filterByKey from '../utils/filterByKey';
import getFullName from '../utils/getFullName';
import db from './db';

export default function structureContact({contact, isUpdate = false}) {
    const name = getFullName(contact);
    const data = {
        ...isUpdate ? {} : {
            id: contact?._id,
            createdAt: new Date(contact?.createdAt),
        },
        name,
        email: contact?.email,
        grade: contact?.grade?.grade,
        role: contact?.grade?.role,
        firstName: contact?.fname,
        lastName: contact?.lname,
        middleName: contact?.mname,
        avatarSrc: contact?.imageUrl,
        origin: contact,
        updatedAt: new Date(contact?.updatedAt),
    };

    Object.keys(data).forEach(key => {
        if(data[key] === undefined) delete data[key];
    });
    return data;
};

export async function setContacts (contacts) {
    const newContacts = [];
    const updateContacts = [];
    const contactsIds = contacts.map(contact => structureContact({contact})?.id); 
    const data = await db?.contacts.bulkGet(contactsIds);
    data?.forEach((contact, index) => {
            const remoteContact = contacts[index];
            if(contact) {
                const localTime = (new Date (contact.updatedAt)).getTime();
                const remoteTime = (new Date (contact.updatedAt)).getTime();
                if(localTime !== remoteTime)
                    updateContacts.push({
                        key: remoteContact.id,
                        changes: structureContact({
                            contact: remoteContact,
                            isUpdate: true,
                        })
                    })
            }
            else newContacts.push(structureContact({
                contact: remoteContact,
            }));
        });
    if(newContacts.length)
        await db?.contacts.bulkAdd(filterByKey(newContacts));
    if(updateContacts.length)
        await db?.contacts.bulkUpdate(filterByKey('key', updateContacts));
    return 'update';
}