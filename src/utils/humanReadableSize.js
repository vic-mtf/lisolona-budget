export default function humanReadableSize(sizeInBytes = 0, unit = 1024) {
    const units = ["o", "Ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo"];
    let i = 0;
    while (sizeInBytes >= unit) {
      sizeInBytes /= unit;
      i++;
    }
    return sizeInBytes.toFixed(2) + " " + units[i];
  }
  