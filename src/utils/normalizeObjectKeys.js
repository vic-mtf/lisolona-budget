import { isPlainObject } from "@reduxjs/toolkit";

export const omitKeysFromObject = (obj, keys) => {
  const result = { ...obj };
  (Array.isArray(keys) ? keys : [keys]).forEach((key) => delete result[key]);
  return result;
};

const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const extractValueFromAliases = (obj = {}, keys = []) => {
  for (const key of keys) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      return typeof val === "string" ? val.trim() || null : val;
    }
  }
  return undefined;
};
export default function normalizeObjectKeys(
  data = {},
  keyAliases = userKeyAliases
) {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeObjectKeys(item, keyAliases));
  }

  if (!isPlainObject(data)) return data;

  const result = {};
  const processedKeys = new Set();

  // Appliquer les alias uniquement si une référence existe
  for (const [targetKey, aliases] of Object.entries(keyAliases)) {
    const keysToCheck = [
      targetKey,
      ...(Array.isArray(aliases) ? aliases : [aliases]),
    ];
    const foundKey = keysToCheck.find((k) =>
      Object.hasOwnProperty.call(data, k)
    );

    if (foundKey !== undefined) {
      const value = extractValueFromAliases(data, keysToCheck);
      result[targetKey] = normalizeObjectKeys(value, keyAliases);
      keysToCheck.forEach((k) => processedKeys.add(k));
    }
  }

  // Traiter les autres clés non mappées
  for (const [key, value] of Object.entries(data)) {
    if (processedKeys.has(key)) continue;
    const camelKey = toCamelCase(key);
    result[camelKey] = normalizeObjectKeys(value, keyAliases);
  }

  return result;
}

export const normalizeUserData = (obj) =>
  normalizeObjectKeys({
    ...obj,
    grade: obj.grade?.grade || obj?.grade,
    role: obj?.grade?.role || obj?.role,
  });

export const userKeyAliases = {
  id: ["_id", "userId"],
  email: ["userEmail"],
  firstName: ["userFname", "fname", "userFName"],
  lastName: ["userLname", "lname", "userLName"],
  middleName: ["userMname", "mname", "userMName"],
  number: ["phoneCell"],
  image: ["userImage", "imageUrl"],
  subType: ["subtype"],
};
