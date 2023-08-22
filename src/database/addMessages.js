import db from './db';
export default function addMessages ({messages}) {
    return Promise.all(messages?.map(message => new Promise(
        (resolve, reject) => {
            db.messages.add(message).then(resolve).catch(reject)
    })));
}