import initDataBase from "./initDataBase";

export const getMedias = ({userId, target}) => {
    const db = initDataBase({userId});
    return db.messages.filter(({type}) => {
        const conds = [type === 'media'];
        return eval(conds.map(cond => cond.toString()).join(' && '))
    }).toArray();
}