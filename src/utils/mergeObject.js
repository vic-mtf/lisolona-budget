export default  function mergeDeep(obj1, obj2) {
  if (!obj1 && !obj2) {
    return {};
  }
  if (!obj1) {
    return obj2;
  }
  if (!obj2) {
    return obj1;
  }
  
  Object.keys(obj2).forEach(key => {
    if (Object.getOwnPropertyDescriptor(obj1, key) && Object.getOwnPropertyDescriptor(obj1, key).writable === false) {
      return;
    }
    if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key])) {
      if (!obj1[key]) obj1[key] = {};
      mergeDeep(obj1[key], obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  });
  return obj1;
}

