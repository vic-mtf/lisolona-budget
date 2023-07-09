import initDataBase from "../initDataBase";

export default function addMessages ({messages, userId}) {
    const db = initDataBase();
    return Promise.all(messages?.map(message => new Promise(
        (resolve, reject) => {
            db.messages.add(message).then(resolve).catch(reject)
    })));
}