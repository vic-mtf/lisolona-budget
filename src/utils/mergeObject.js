export default  function mergeObject(_obj1, _obj2) {
  if (!_obj1 && !_obj2) return {};
  if (!_obj1) return _obj2;
  if (!_obj2) return _obj1;
  let obj1 = cloneObject(_obj1);
  let obj2 = cloneObject(_obj2);
  Object.keys(obj2).forEach(key => {
    if (Object.getOwnPropertyDescriptor(obj1, key) && Object.getOwnPropertyDescriptor(obj1, key).writable === false) 
      return;
    if (isObjectLiteral(obj2[key]) && !Array.isArray(obj2[key])) {
      if (!obj1[key]) obj1[key] = {};
      mergeObject(obj1[key], obj2[key]);
    } else obj1[key] = obj2[key];
  });
  return obj1;
}

export function deepMerge(_obj1, _obj2) {
  if (!_obj1 && !_obj2) return {};
  if (!_obj1) return _obj2;
  if (!_obj2) return _obj1;
  let obj1 = cloneObject(_obj1);
  let obj2 = cloneObject(_obj2);
  const output = Object.assign({}, obj1); // clone obj1 to the output

  // If obj2 is an object literal
  if (isObjectLiteral(obj2)  && obj2 !== null && !Array.isArray(obj2)) {
    Object.keys(obj2).forEach(key => {
      // If the current property of obj2 is an object literal itself
      if (isObjectLiteral(obj2[key]) && obj2[key] !== null && !Array.isArray(obj2[key])) {
        // If the current property of obj1 is not an object literal
        if (!isObjectLiteral(obj1[key]) || obj1[key] === null || Array.isArray(obj1[key])) {
          output[key] = Object.assign({}, obj2[key]);
        } else {
          // Recursive call to deepMerge
          output[key] = deepMerge(obj1[key], obj2[key]);
        }
      } else {
        output[key] = obj2[key];
      }
    });
  }

  return output;
}


export function cloneObject(obj) {
  let clonedObj = {};
  Object.keys(obj).forEach(function(key) {
    if (isObjectLiteral(obj[key]))
      clonedObj[key] = cloneObject(obj[key]);
    else clonedObj[key] = obj[key];
  });
  return clonedObj;
}


export function isObjectLiteral(obj) {
  return obj ? 
  Object.prototype.toString.call(obj) === '[object Object]' &&   
  Object.getPrototypeOf(obj) === Object.prototype &&
  typeof obj === 'object'
  : false;
};


// export function isObjectLiteral(obj) {
//   return obj ? Object.getPrototypeOf(obj) === Object.prototype : false;
// }

