import pdfIcon from '../icons/icons8-adobe-acrobat-48.png';
import powerPointIcon from '../icons/icons8-microsoft-powerpoint-2019-48.png';
import photoIcon from '../icons/icons8-photos-48.png';
import videoIcon from '../icons/icons8-film-48.png';
import excelIcon from '../icons/icons8-microsoft-excel-2019.svg'
import wordIcon from '../icons/icons8-microsoft-word-2019.svg';
import audioIcon from '../icons/icons8-notes-de-musique-48.png';

const fileExtensionBase = [
    {
        exts: ['doc','docx',],
        icon: wordIcon,
        type: 'document',
        docType: 'word',
    },
    {
      exts: ['pptx','ppt',],
      icon: powerPointIcon,
      type: 'document',
      docType: 'power point',
    },
    {
      exts: ['xls','xml', 'xlsx'],
      icon: excelIcon,
      type: 'document',
      docType: 'excel',
    },
    {
      exts: ['pdf'],
      icon: pdfIcon,
      type: 'document',
      docType: 'poratable document format',
    },
    {
      exts: ['ico', 'cur', 'tif', 'tiff', 'apng', 'avif', 'gif', 'webp', 'svg', 'png', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'bmp'],
      icon: photoIcon,
      type: 'image',
      docType: 'image',
    },
    {
      exts: [ 'webm','qt', 'mov', 'ogg', 'avi', 'asf', 'wma', 'wmv', 'flv', 'mkv', 'mka', 'mks', 'mk3d', 'mp4', 'mp4a', 'mp4b', 'mp4r', 'mp4v', 'mp4p', 'mpg', 'mpeg', 'mxf'],
      icon: videoIcon,
      type: 'video',
      docType: 'video',
    },
    {
      exts: ['mp3'],
      icon: audioIcon,
      type: 'audio',
      docType: 'audio',
    }
];

export default fileExtensionBase;