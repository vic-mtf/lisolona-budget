import { isPlainObject } from "lodash";

export default function modifyObject(obj1, obj2) {
    if (isPlainObject(obj2.data) && obj2.key === undefined) {
        Object.keys(obj2.data).forEach(key => {
            if (obj1.hasOwnProperty(key)) {
                if (isPlainObject(obj1[key]) && isPlainObject(obj2.data[key])) 
                    Object.keys(obj2.data[key]).forEach(subKey => {
                        if (obj1[key].hasOwnProperty(subKey)) 
                            obj1[key][subKey] = obj2.data[key][subKey];
                    });
                else obj1[key] = obj2.data[key];
            }
        });
    } else if (obj2.data !== undefined && typeof obj2.key === 'string') {
        let keys = obj2.key.split('.');
        let currentObj = obj1;
        keys.forEach((key, index) => {
            if (currentObj.hasOwnProperty(key)) {
                if (index === keys.length - 1) currentObj[key] = obj2.data;
                else currentObj = currentObj[key];
            } else return;
        });
    }
}

