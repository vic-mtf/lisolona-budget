import { isPlainObject } from "@reduxjs/toolkit";

type DeepRecord = Record<string, unknown>;

export default function deepMerge(
  oldObject: DeepRecord,
  newObject: DeepRecord
): DeepRecord {
  const result = Object.assign({}, oldObject);

  Object.keys(newObject).forEach((key) => {
    if (key === undefined || key.trim() === "") {
      console.warn("key is undefined or empty");
      return;
    }
    if (isPlainObject(newObject[key]) && isPlainObject(oldObject[key])) {
      result[key] = deepMerge(
        oldObject[key] as DeepRecord,
        newObject[key] as DeepRecord
      );
    } else {
      const newState = newObject[key];
      result[key] =
        typeof newState === "function"
          ? (newState as (prev: unknown) => unknown)(result[key])
          : newState;
    }
  });

  return result;
}

export function getValueByKey(
  obj: DeepRecord,
  key: string
): unknown | undefined {
  const keys = key.split(".");
  let current: unknown = obj;
  for (let i = 0; i < keys.length; i++) {
    if (
      current &&
      typeof current === "object" &&
      Object.hasOwnProperty.call(current, keys[i])
    )
      current = (current as DeepRecord)[keys[i]];
    else return;
  }
  return current;
}

export function setValueByKey(
  obj: DeepRecord,
  key: string,
  value?: unknown
): DeepRecord {
  const keys = key.split(".");
  let current: DeepRecord = obj;
  keys.slice(0, -1).forEach((key) => {
    const notObject = !isPlainObject(current[key]);
    if (!Object.hasOwnProperty.call(current, key) || notObject)
      current[key] = {};
    current = current[key] as DeepRecord;
  });
  current[keys[keys.length - 1]] = value;
  return { ...obj };
}
