import db from "./db";

export default function updateMessages ({updateMessages: updates}) {
    return new Promise(async (resolve, reject) => {
        try {
            let request;
            if(updates.length > 1) 
                request = await db?.messages.bulkUpdate(updates);
            if(updates.length === 1) {
                const [data] = updates;
                request = await db?.messages.update(data.key, data.changes);
            }
            resolve(request);
        } catch (error) {
            reject(error);
        }
    });
}