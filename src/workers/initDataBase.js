import Dexie from "dexie";
import dbConfig from '../configs/database-config.json';
const {
    name,
    options,
    version
} = dbConfig;

export default function initDataBase () {
    const db = new Dexie(name, options);
    const stores = {};
    dbConfig.stores.forEach(({keys, name}) => stores[name] = keys.join(','));
    db?.version(version).stores(stores);
    return db;
}