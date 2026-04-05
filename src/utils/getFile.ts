import { isPlainObject } from "lodash";

export default function getFile(props) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.style.display = "none";
  fileInput.webkitdirectory = false;
  return new Promise((resolve, reject) => {
    if (isPlainObject(props))
      Object.keys(props).forEach((prop) => {
        fileInput[prop] = props[prop];
      });
    fileInput.value = "";
    fileInput.onchange = (event) => {
      const { files } = event.target;
      if (files?.length) resolve([...files].filter(({ type }) => type?.trim()));
      else reject(new Error("impossible to get files"));
      delete fileInput.onchange;
    };
    fileInput.click();
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

export const getType = (file) => file.type.split("/")[0];

export const supportedImageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
  "tif",
  "tiff",
  "avif",
];

export const supportedAudioExtensions = [
  "mp3",
  "wav",
  "ogg",
  "aac",
  "m4a",
  "opus",
  "flac",
];

export const supportedVideoExtensions = [
  "mp4",
  "webm",
  "ogg",
  "mkv",
  "mov",
  "avi",
];

export const supportedDocumentExtensions = [
  "pdf",
  "doc",
  "docx",
  "odt",
  "xls",
  "xlsx",
  "ods",
  "ppt",
  "pptx",
  "txt",
  "rtf",
  "csv",
  // "html",
  // "xml",
  // "json",
  // "md",
];
