export default function getFileNameAndExtension(filePath) {
  const lastSlashIndex = filePath.lastIndexOf('/');
  let fileNameAndExtension = filePath.substring(lastSlashIndex + 1);
  const timestampRegex = /\d{10,}/;
  const match = fileNameAndExtension.match(timestampRegex);
  if (match)
    fileNameAndExtension = fileNameAndExtension.replace(match[0], '');
  const lastDotIndex = fileNameAndExtension.lastIndexOf('.');
  const fileName = fileNameAndExtension.substring(0, lastDotIndex);
  const extension = fileNameAndExtension.substring(lastDotIndex + 1);
  const fileNameWithSpaces = fileName.replace(/_/g, ' ');
  return `${fileNameWithSpaces}.${extension}`;
}