import { isPlainObject } from "lodash";

export default function mergeDeep(oldObj, newObj) {
  let output = Object.assign({}, oldObj);
  if (isPlainObject(oldObj) && isPlainObject(newObj)) {
      Object.keys(newObj).forEach(key => {
          if (isPlainObject(newObj[key])) {
              if (!(key in oldObj))
                  Object.assign(output, { [key]: newObj[key] });
              else
                  output[key] = mergeDeep(oldObj[key], newObj[key]);
          } else {
              Object.assign(output, { [key]: newObj[key] });
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
