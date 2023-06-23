import db from "../database/db";

export default function observeLastModification (table, callback) {
  const handleChange = (changes) => {
    changes.forEach(change => {
      if (change.table === table) {
        db?.table(table).get(change.key).then((obj) => {
          const updated = change.type === 2;
          callback(obj, updated);
        });
      }
    });
  };
  db?.on('changes', handleChange);
  return () => {  
    db?.on('changes')?.unsubscribe(handleChange);
  }
}