import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/scripts/pdf.worker.min.js`;

export default function getPdfPageInfos(pdf) {
  const isFile = pdf instanceof File;
  const pdfUrl = isFile ? URL.createObjectURL(pdf) : pdf;
  return new Promise((resolve, reject) => {
    const pdfDocPromise = pdfjsLib.getDocument(pdfUrl).promise;
    pdfDocPromise.then(async pdfDoc => {
      try {
        const {numPages} = pdfDoc._pdfInfo;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          resolve({
            coverUrl: canvas.toDataURL(),
            numPages
          });
          if(isFile) URL.revokeObjectURL(pdfUrl);
        });
      } catch (err) {
        reject(err);
      }
    }).catch(err => reject(err));
  });
}
