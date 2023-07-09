import pdfIcon from '../icons/icons8-adobe-acrobat-48.png';
import powerPointIcon from '../icons/icons8-microsoft-powerpoint-2019-48.png';
import photoIcon from '../icons/icons8-photos-48.png';
import videoIcon from '../icons/icons8-film-48.png';
import excelIcon from '../icons/icons8-microsoft-excel-2019.svg'
import wordIcon from '../icons/icons8-microsoft-word-2019.svg';
import audioIcon from '../icons/icons8-notes-de-musique-48.png';
import zipIcon from '../icons/MetroUI-Other-ZIP-Archive-icon.png';
import appIcon from '../icons/7039_exe_hardware_hospital_install_installer_icon.png';
import textIcon from '../icons/88542_document_txt_icon.png';
import codeIcon from '../icons/Apps-File-Xml-icon.png';

const fileExtensionBase = [  
  {    
    exts: ['7z', 'gz'],
    icon: zipIcon,
    type: 'document',
    docType: 'archive',
    typeMIME: ['application/x-7z-compressed', 'application/gzip']
  },
  {
    exts: ['apk', 'ipa', 'jar', 'exe'],
    icon: appIcon,
    type: 'application',
    docType: 'application',
    typeMIME: ['application/vnd.android.package-archive', 'application/octet-stream', 'application/java-archive', 'application/x-msdownload']
  },
  {
    exts: ['bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'svg', 'webp'],
    icon: photoIcon,
    type: 'image',
    docType: '',
    typeMIME: ['image/bmp', 'image/gif', 'image/ico', 'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp']
  },
  {
    exts: ['doc', 'docx'],
    icon: wordIcon,
    type: 'document',
    docType: 'word',
    typeMIME: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  {
    exts: ['xls', 'xlsx'],
    icon: excelIcon,
    type: 'document',
    docType: 'excel',
    typeMIME:['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  },
  {
    exts: ['pptx', 'ppt'],
    icon: powerPointIcon,
    type: 'document',
    docType: 'power point',
    typeMIME: ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint']
  },
  {
    exts: ['js'],
    icon: codeIcon,
    type: 'document',
    docType: 'JavaScript file',
    typeMIME: ['application/javascript']
  },
  {
    exts: ['json'],
    icon: codeIcon,
    type: 'document',
    docType: 'JSON file',
    typeMIME: ['application/json']
  },
  {
    exts: ['mp3','wav','ogg','m4a','flac','aac','wma'],
    icon: audioIcon,
    type: 'audio',
    docType: '',
     typeMIME:['audio/mpeg','audio/wav','audio/ogg','audio/x-m4a','audio/flac','audio/aac','audio/x-ms-wma']
  },
  {
    exts:['pdf'],
    icon : pdfIcon,
    type : "document",
    docType : "pdf",
     typeMIME:['application/pdf']
  },
  {
      exts : ["txt"],
      icon : textIcon,
      type : "document",
      docType : "text",
      typeMIME:['text/plain']
  },
  {
      exts : ["mp4", "webm", "ogg"],
      icon : videoIcon,
      type : "video",
      docType : "",
      typeMIME:['video/mp4','video/webm','video/ogg']
  }
];




export default fileExtensionBase;