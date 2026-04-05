import { useState } from "react";
import file_pdf from "../assets/11406-programmez-avec-le-langage-c.pdf";
import * as PdfLib from "pdfjs-dist";
import * as workerSrc from "pdfjs-dist/build/pdf.worker.min.js";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();

PdfLib.GlobalWorkerOptions.workerSrc = workerSrc;

PdfLib.getDocument(file_pdf).promise.then((pdf) => {

});

const DocReader = () => {
  return null;
  //   const [numPages, setNumPages] = useState();
  //   const [pageNumber, setPageNumber] = useState(1);

  //   const onDocumentLoadSuccess = ({ numPages }) => {
  //     setNumPages(numPages);
  //   };

  //   return (
  //     <div>
  //       <Document file={file_pdf} onLoadSuccess={onDocumentLoadSuccess}>
  //         <Page pageNumber={pageNumber} />
  //       </Document>
  //       <p>
  //         Page {pageNumber} of {numPages}
  //       </p>
  //       <button onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}>
  //         Previous Page
  //       </button>
  //       <button onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}>
  //         Next Page
  //       </button>
  //     </div>
  // );
};

export default DocReader;
