import StrikethroughSOutlinedIcon from '@mui/icons-material/StrikethroughSOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import AlignHorizontalLeftRoundedIcon from '@mui/icons-material/AlignHorizontalLeftRounded';
// import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
// import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded';
import FormatAlignCenterRoundedIcon from '@mui/icons-material/FormatAlignCenterRounded';

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
    },
    {
        title: 'bloc de citation',
        id: 'blockquote',
        icon: <AlignHorizontalLeftRoundedIcon fontSize="small"/>,
    },
    {
        title: 'En-tête 1',
        id: 'header-one',
        icon: <span style={{fontWeight: 'bold'}}> H1 </span>,
    },
    {
        title: 'En-tête 2',
        id: 'header-two',
        icon: <span style={{fontWeight: 'bold'}}> H2 </span>,
    },
    {
        title: 'En-tête 3',
        id: 'header-three',
        icon: <span style={{fontWeight: 'bold'}}> H2 </span>,
    },
    {
        title: 'En-tête 4',
        id: 'header-four',
        icon: <span style={{fontWeight: 'bold'}}> H4 </span>,
    },
    {
        title: 'En-tête 5',
        id: 'header-five',
        icon: <span style={{fontWeight: 'bold'}}> H5 </span>,
    },
    {
        title: 'En-tête 6',
        id: 'header-six',
        icon: <span style={{fontWeight: 'bold'}}> H6 </span>,
    }
    
];

export const textAlignOptions = [
    {
        title: 'Aligner à gauche',
        id: 'left',
        icon: <FormatAlignLeftRoundedIcon fontSize="small"/>,
    },
    {
        title: 'Centrer',
        id: 'center',
        icon: <FormatAlignCenterRoundedIcon fontSize="small"/>,
    },
    {
        title: 'Aligner à droite',
        id: 'right',
        icon: <FormatAlignRightRoundedIcon fontSize="small"/>,
    },
]