export default function humanReadableSize(
  sizeInBytes = 0,
  unit = 1024,
  fixed = 2
) {
  const units = ["o", "Ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo"];
  let i = 0;
  while (sizeInBytes >= unit) {
    sizeInBytes /= unit;
    i++;
  }
  return sizeInBytes.toFixed(fixed) + " " + units[i];
}
