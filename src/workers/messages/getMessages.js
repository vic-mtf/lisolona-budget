import structureMessages from "../../utils/structureMessages";
import initDataBase from "../initDataBase";
const MAX_ARRAY_LENGTH = 20;

export default function getMessages ({userId, offset, target}) {
    const db = initDataBase();
    return new Promise((resolve, reject) => {
        db?.messages
        .filter(({targetId}) => targetId === target.id)
        .toArray().then(data => {
            const messages = structureMessages(data);
            resolve(messages.slice(offset, offset + MAX_ARRAY_LENGTH));
        }).catch(err => reject(err));
      });
}