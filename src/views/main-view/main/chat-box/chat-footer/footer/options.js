import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import fileExtensionBase from '../../../../../utils/fileExtensionBase';

const docExts = [];
fileExtensionBase.forEach(item => {
  docExts.push(...item.exts);
});

export const acceptExtension = docExts.map(ext => `.${ext}`).join(',');

const options = [
  { 
    icon: <ImageOutlinedIcon fontSize="small"  />, 
    tooltipTitle: 'Photos & Vidéos',
    accept: 'video/*, image/*'
  },
  //{ icon: <SlideshowOutlinedIcon  fontSize="small" />, name: 'Vidéos' },
  { 
    icon: <ArticleOutlinedIcon fontSize="small"  />, 
    tooltipTitle: 'Documents', 
    accept: docExts.map(ext => `.${ext}`).join(',')
  },
];

export default options;