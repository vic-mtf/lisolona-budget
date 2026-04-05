import { isPlainObject } from "lodash";

const purifyObject = (obj) =>
  isPlainObject(obj) ? window.JSON.parse(window.JSON.stringify(obj)) : null;
export default purifyObject;
