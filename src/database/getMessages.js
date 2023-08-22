import structureMessages from "../utils/structureMessages";
import db from './db';
const MAX_ARRAY_LENGTH = 20;

export default function getMessages ({offset, target}) {
    return new Promise((resolve, reject) => {
        db?.messages
        .filter(({targetId}) => targetId === target.id)
        .toArray().then(data => {
            const messages = structureMessages(data);
            resolve(messages.slice(offset, offset + MAX_ARRAY_LENGTH));
        }).catch(err => reject(err));
      });
}