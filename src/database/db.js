import Dexie from 'dexie';
import "dexie-observable";
import dbConfig from '../configs/database-config.json';

const db = new Dexie(dbConfig.name, dbConfig.options);
const stores = {};
dbConfig.stores.forEach(({keys, name}) => {
    stores[name] = keys.join(',');
});
db.version(dbConfig.version).stores(stores);

export default db;

export function clearDatabase() {
    return db.transaction('rw', db.tables, () => {
      return Promise.all(db.tables.map(table => table.clear()));
    });

}

export async function checkTables() {
    let dataBase = null;
    try {
      dataBase = await (new Dexie(dbConfig.name)).open();
    } catch (e) {}
   
    const dbTables = dataBase?.tables.map(table => ({ 
        name: table.name, 
        keys: table.schema.indexes.map(index => index.name) 
      })
    );
    const isSame = dbConfig.stores.every(store => {
      const dbTable = dbTables?.find(table => table.name === store.name);
      if (!dbTable) return false;
      return store.keys.filter(key => key !== 'id').sort().join() === dbTable.keys.sort().join();
    });
    if(!isSame && dataBase) {
        Dexie.getDatabaseNames().then(async names => {
           await Promise.all(names.map(
                name => new Promise((resolve, reject) => {
                Dexie.delete(name).then(resolve).catch(reject);
            })));
            window.location.reload();
        });
    }

}
checkTables();