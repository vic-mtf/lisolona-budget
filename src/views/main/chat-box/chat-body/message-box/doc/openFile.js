export default function openFile(file) {
    const url = window.URL.createObjectURL(file);
    window.open(url, '_blank');
    window.URL.revokeObjectURL(url);
  }