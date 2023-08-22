import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { Badge, ClickAwayListener, ToggleButton, alpha } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { CustomPaper, ToggleButtonGroup } from '../WritingAreaHeader';
import ElasticPopper from './ElasticPopper';
import { RichUtils } from 'draft-js';

export default function BlockStyleButton (props) {
    const {icon, label, value, getEditorState, setEditorState, ...otherProps} = props;
    
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

export function BlockStyleButtonHeader (props) {
    const {onChangeHeader, valueHeader, ...otherProps} = props;
    const [open, setOpen] = useState(false);
    const anchorElRef = useRef();
    
    const button = useMemo(() => 
        headerStyles.find(button => button.id === valueHeader[0]) || {}, 
        [valueHeader]
    );
    const selected = useMemo(() => Boolean(button.value), [button.value]);

    return (
        <>
            <ClickAwayListener
                onClickAway={() => open ? setOpen(false) : null}
            >  
                <div
                    style={{ position: 'relative'}}
                    className={otherProps.className}
                >
                    <ToggleButton 
                            {...otherProps}
                            value="" 
                            aria-label={button.value} 
                            className={otherProps.className}
                            size="small"
                            selected={selected || open}
                            onChange={null}
                            ref={anchorElRef}
                            title={button.label || 'Entête'}
                            onMouseDown={event => event.preventDefault()}
                            onMouseUp={event => event.preventDefault()}
                            onClick={() => setOpen(state => !state)}
                    >
                        <Badge 
                            badgeContent={button.icon} 
                            color="default"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                }
                            }}
                        >
                            <TitleOutlinedIcon fontSize="small"/>
                        </Badge>
                    </ToggleButton>
                
                    <ElasticPopper
                        open={open}
                        anchorEl={anchorElRef.current}
                        placement="right"
                    >
                        <CustomPaper
                            sx={{
                                backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                                background: 'transparent',
                                mx: .5,
                                '& .MuiToggleButtonGroup-grouped': {
                                    mx: .5,
                                }
                            }}
                        >
                            <div
                                style={{ position: 'relative'}}
                                className={otherProps.className}
                            >
                                <ToggleButtonGroup
                                    onClick={() => setOpen(false)}
                                    onChange={onChangeHeader}
                                    value={valueHeader}
                                >
                                    {headerStyles.map(head => (
                                        <ToggleButton 
                                            key={head.id}
                                            value={head.value}
                                            aria-label={head.value} 
                                            onMouseDown={event => event.preventDefault()}
                                            onMouseUp={event => event.preventDefault()}
                                            size="small"
                                            sx={{px: 1}}
                                        >
                                            {head.icon}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </div>
                        </CustomPaper>
                    </ElasticPopper>
                </div>
            </ClickAwayListener>
        </>
    );
}

export const useBlockStyles = (editorState) => {
    const value = RichUtils.getCurrentBlockType(editorState);
    const find = blockStyles.find(headerStyle => headerStyle.value === value);
    return find ? [find.value]: [];
};

export const useHeaderStyles = (editorState) => {
    const value = RichUtils.getCurrentBlockType(editorState);
    const find = headerStyles.find(headerStyle => headerStyle.value === value);
    return find ? [find.value]: [];
}

export const blockStyles = [
    {
        label: 'Liste à puce',
        id: 'unordered-list-item',
        value: 'unordered-list-item',
        icon: <FormatListBulletedOutlinedIcon fontSize="small" />,
        type: 'block',
    },
    {
        label: 'Liste numérotée',
        id: 'ordered-list-item',
        value: 'ordered-list-item',
        icon: <FormatListNumberedOutlinedIcon fontSize="small" />,
        type: 'block',
    },
    {
        label: 'bloc de citation',
        id: 'blockquote',
        value: 'blockquote',
        icon: <AlignHorizontalLeftIcon fontSize="small" />,
        type: 'block',
    },
    // {
    //     label: 'Bloque de code',
    //     id: 'code-block',
    //     value: 'code-block',
    //     icon: <IntegrationInstructionsOutlinedIcon/>,
    //     type: 'block',
    // },
];

export const headerStyles = [
    {
        label: 'Entête 1',
        id: 'header-one',
        value: 'header-one',
        icon: 'H1',
        type: 'block',
    },
    {
        label: 'Entête 2',
        id: 'header-two',
        value: 'header-two',
        icon: 'H2',
        type: 'block',
    },
    {
        label: 'Entête 3',
        id: 'header-three',
        value: 'header-three',
        icon: 'H3',
        type: 'block',
    },
    {
        label: 'Entête 4',
        id: 'header-four',
        value: 'header-four',
        icon: 'H4',
        type: 'block',
    },
    {
        label: 'Entête 5',
        id: 'header-five',
        value: 'header-five',
        icon: 'H5',
        type: 'block',
    },
    {
        label: 'Entête 6',
        id: 'header-six',
        value: 'header-six',
        icon: 'H6',
        type: 'block',
    }
];

