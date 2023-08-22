import FormatAlignCenterOutlinedIcon from '@mui/icons-material/FormatAlignCenterOutlined';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
import FormatAlignRightOutlinedIcon from '@mui/icons-material/FormatAlignRightOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import FormatStrikethroughOutlinedIcon from '@mui/icons-material/FormatStrikethroughOutlined';
import StrikethroughSOutlinedIcon from '@mui/icons-material/StrikethroughSOutlined';
import SuperscriptOutlinedIcon from '@mui/icons-material/SuperscriptOutlined';
import SubscriptOutlinedIcon from '@mui/icons-material/SubscriptOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { ToggleButton } from '@mui/material';
import { useMemo } from 'react';

export default function InlineStyleButton (props) {
    const {icon, label, value, getEditorState, setEditorState,...otherProps} = props;
    
    return (
        <div
            className={otherProps.className}
        >
            <ToggleButton 
                value={value} 
                aria-label={value} 
                title={label}
                {...otherProps}
                onMouseDown={event => event.preventDefault()}
                onMouseUp={event => event.preventDefault()}
            >{icon}
            </ToggleButton>
        </div>
    );
}

export const useInlineStyles = (editorState) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    const values = useMemo(() => 
        inlineStyles.filter(({id}) => currentStyle.has(id))
        .map(({value}) => value)
    , [currentStyle]);
    return values;
};

export const useTextAlign = (editorState) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    const { value } = useMemo(() => 
        alignTextStyles.find(({id}) => currentStyle.has(id)) || {}
    , [currentStyle]);
    return value;
};

export const inlineStyles = [
    {
        label: 'Gras',
        id: 'BOLD',
        value: 'bold',
        icon: <FormatBoldOutlinedIcon fontSize="small" />,
        type: 'inline',
    }, 
    {
        label: 'Italique',
        id: 'ITALIC',
        value: 'italic',
        icon: <FormatItalicOutlinedIcon fontSize="small" />,
        type: 'inline',
    },
    {
        label: 'Souligner',
        id: 'UNDERLINE',
        value: 'underline',
        icon: <FormatUnderlinedOutlinedIcon fontSize="small" />,
        type: 'inline',
    },
    {
        label: 'Barrer',
        id: 'STRIKETHROUGH',
        value: 'strikethrough',
        icon: <StrikethroughSOutlinedIcon fontSize="small" />,
        type: 'inline',
    },
    {
        label: 'Mettre en exposant',
        id: 'SUPERSCRIPT',
        value: 'superscript',
        icon: <SuperscriptOutlinedIcon fontSize="small" />,
        inverse: 'SUBSCRIPT',
        type: 'inline',
    },
    {
        label: 'mettre en indice',
        id: 'SUBSCRIPT',
        value: 'subscript',
        icon: <SubscriptOutlinedIcon fontSize="small" />,
        inverse: 'SUPERSCRIPT',
        type: 'inline',
    },
    {
        label: 'Code',
        id: 'CODE',
        value: 'code',
        icon: <CodeOutlinedIcon fontSize="small" />,
        type: 'inline',
    },
];

export const alignTextStyles = [
    {
       label: 'Alignement gauche',
       id: 'left',
       value: 'left',
       icon: <FormatAlignLeftOutlinedIcon fontSize="small" />,
       type: 'inline',
   }, 
   {
       label: 'Centré',
       id: 'center',
       value: 'center',
       icon: <FormatAlignCenterOutlinedIcon fontSize="small" />,
       type: 'inline',
   },
   {
       label: 'Alignement droit',
       id: 'right',
       value: 'right',
       icon: <FormatAlignRightOutlinedIcon fontSize="small" />,
       type: 'inline',
   },
];