import { isPlainObject } from "lodash";

const inputFile = document.createElement("input");

inputFile.webkitdirectory = false;
export default function getFile(props = inputFile) {
  return new Promise((resolve, reject) => {
    if (isPlainObject(props))
      Object.keys(props).forEach((prop) => {
        inputFile[prop] = props[prop];
      });
    inputFile.type = "file";
    inputFile.value = "";
    inputFile.onchange = (event) => {
      const { files } = event.target;
      if (files?.length) resolve([...files].filter(({ type }) => type?.trim()));
      else reject(new Error("impossible to get files"));
    };
    inputFile.click();
  });
}

export const getExtension = (fileName = null) => {
  return fileName
    ? String(fileName)
        .slice(String(fileName).lastIndexOf(".") + 1, String(fileName).length)
        .trim()
    : null;
};

export const getName = (fileName = null) =>
  fileName
    ? String(fileName).slice(0, String(fileName).lastIndexOf(".")).trim()
    : null;
