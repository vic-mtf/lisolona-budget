import { isPlainObject } from "@reduxjs/toolkit";

export default function deepMerge(oldObject, newObject) {
  let result = Object.assign({}, oldObject);
  Object.keys(newObject).forEach((key) => {
    if (isPlainObject(newObject[key]) && isPlainObject(oldObject[key]))
      result[key] = deepMerge(oldObject[key], newObject[key]);
    else {
      const newState = newObject[key];
      result[key] =
        typeof newState === "function" ? newState(result[key]) : newState;
    }
  });
  return result;
}
