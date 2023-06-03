import Dexie from 'dexie';
import "dexie-observable";
import dbConfig from '../configs/database-config.json';
const { 
    name, 
    version, 
    options, 
    stores
} = dbConfig;
let db;
const localData = window.localStorage.getItem(name);
const _options = JSON.stringify(dbConfig.stores);

export const initDataBase = _name => {
    const localOptions = localData && JSON.parse(localData);
    const userId = window.localStorage.getItem(`${name}-user-database-id`);
    if(userId) {
        db = new Dexie(`${name}-${userId}`, localOptions || options);
        const _stores = {};
        stores.forEach(({keys, name}) => {
            _stores[name] = keys.join(',');
        });
        db.version(version).stores(_stores);
        return db;
    }
}
if(localData === _options)
initDataBase();
export default db;
