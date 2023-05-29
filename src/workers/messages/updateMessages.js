import initDataBase from "../initDataBase";

export default function getCover ({updateMessages: updates, userId}) {
    const db = initDataBase({userId});
    return new Promise(async (resolve, reject) => {
        try {
            let request;
            if(updates.length > 1) 
                request = await db.messages.bulkUpdate(updates);
            if(updates.length === 1) {
                const [data] = updates;
                request = await db.messages.update(data.key, data.changes);
            }
            resolve(request);
        } catch (error) {
            reject(error);
        }
    });
}