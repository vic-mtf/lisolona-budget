import { getValFromObj } from "./getFullName";

export default function formatObjectData(
  data = {},
  keyConfig = userFormatConfig
) {
  const result = {};
  Object.keys(data).forEach((key) => {
    const keys = [];
    Object.keys(keyConfig).forEach((configKey) => {
      const _configKeys = keyConfig[configKey];
      const configKeys = [
        configKey,
        ...(Array.isArray(_configKeys) ? _configKeys : [_configKeys]),
      ];
      configKeys.forEach((k) => !keys.includes(k) && keys.push(k));
      if (
        configKeys.find((key) => data.hasOwnProperty(key)) &&
        result[configKey] === undefined
      )
        result[configKey] = getValFromObj(data, configKeys);
    });
    if (!keys.includes(key) && data[key] !== undefined) result[key] = data[key];
  });
  return result;
}

export const deleteKeysFromObject = (obj, keys) => {
  const result = Object.assign({}, obj);
  (Array.isArray(keys) ? keys : [keys]).forEach((key) => delete result[key]);
  return result;
};

export const userFormatConfig = {
  id: ["_id", "userId"],
  email: ["userEmail"],
  firstName: ["userFname", "fname", "userFName"],
  lastName: ["userLname", "lname", "userLName"],
  middleName: ["userMname", "mname", "userMName"],
  number: ["phoneCell"],
  image: ["userImage", "imageUrl"],
};
