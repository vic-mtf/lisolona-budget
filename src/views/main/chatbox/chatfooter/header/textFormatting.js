import StrikethroughSOutlinedIcon from '@mui/icons-material/StrikethroughSOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';

export const textFormatOptions = [
    {
        title: 'Texte en gras',
        id: 'BOLD',
        icon:  <FormatBoldOutlinedIcon fontSize="small" />,
    },
    {
        title: 'Texte en italique',
        id: 'ITALIC',
        icon: <FormatItalicOutlinedIcon fontSize="small"/>,
    },
    {
        title: 'Texte barré',
        id: 'STRIKETHROUGH',
        icon: <StrikethroughSOutlinedIcon fontSize="small"/>
    },
    {
        title: 'Text souligné',
        id: 'UNDERLINE',
        icon: <FormatUnderlinedOutlinedIcon fontSize="small" />
    }
];

export const listFormatOption = [
    {
        title: 'Liste à puces',
        id: 'unordered-list-item',
        icon:  <FormatListBulletedOutlinedIcon fontSize="small" />,
    },
    {
        title: 'Liste numérotée',
        id: 'ordered-list-item',
        icon: <FormatListNumberedOutlinedIcon fontSize="small"/>,
    }
    
];