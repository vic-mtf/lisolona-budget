import initDataBase from "./initDataBase";

export const getMedias = ({target}) => {
    const db = initDataBase();
    return db?.messages.filter(({type}) => {
        const conds = [type === 'media'];
        return eval(conds.map(cond => cond.toString()).join(' && '))
    }).toArray();
}