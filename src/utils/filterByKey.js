export default function filterByKey(_key='id', ..._arrays) {
    const key = Array.isArray(_key) ? 'id' : _key;
    const arrays = Array.isArray(_key) ? [_key, _arrays.flat()].flat() : _arrays;
    const combinedArray = arrays.flat();
    const uniqueObjectsById = {};
    combinedArray.forEach(obj => uniqueObjectsById[obj[key]] = obj);
    return Object.values(uniqueObjectsById);
};