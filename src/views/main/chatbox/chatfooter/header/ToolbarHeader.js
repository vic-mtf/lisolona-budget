import {
    alpha,
    Box as MuiBox, 
    Divider, 
    ToggleButton,
} from '@mui/material';
import CustomToggleButtonGroup from "../../../../../components/CustomToggleButtonGroup";
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import { listFormatOption, textFormatOptions } from './textFormatting';
import { RichUtils } from 'draft-js';

export default function ToolbarHeader ({
    formats,
    editorState,
    handleChange,
    disabled,
    handleChangeFormat,
    listMode,
    showToolbar
}) {
    const handleChangInlineStyle = (event, format) => {
        event.preventDefault();
        const newState = RichUtils.toggleInlineStyle(editorState, format);
        if(newState) {
            handleChange(newState);
            handleChangeFormat(format);
        }
    }
    const handleChangeTextBlock = (event, block) => {
        event.preventDefault();
        const newState = RichUtils.toggleBlockType(editorState, block);
        if(newState) {
            handleChange(newState);
            handleChangeFormat(block);
        }
    }
    const onMouseDown = event => event.preventDefault();
    return ( showToolbar && 
        <MuiBox overflow="hidden">
            <MuiBox 
                sx={{
                    display: 'flex', 
                    flexWrap: 'wrap',
                    bgcolor: theme =>  alpha(theme.palette.common[
                        theme.palette.mode === 'light' ? 'black' : 'white'
                    ], 0.04)
                }}
            >
                <CustomToggleButtonGroup
                    size="small"
                    aria-label="text formatting"
                    onClick={onMouseDown}
                    onMouseDown={onMouseDown}
                    value={formats}
                    
                >
                    {textFormatOptions.map(option => (
                        <ToggleButton 
                            value={option.id}
                            aria-label={option.id}
                            key={option.id}
                            onMouseDown={onMouseDown}
                            onClick={event => handleChangInlineStyle(event, option.id)}
                            title={option.title}
                            disabled={disabled}
                        >
                            {option.icon}
                        </ToggleButton>
                    ))}
                </CustomToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                <CustomToggleButtonGroup
                    size="small"
                    aria-label="text formatting list"
                    disabled={disabled}
                    value={listMode}
                >
                    {listFormatOption.map(option => (
                        <ToggleButton 
                            value={option.id}
                            aria-label={option.id}
                            key={option.id}
                            onMouseDown={onMouseDown}
                            onClick={event => handleChangeTextBlock(event, option.id)}
                            title={option.title}
                        >
                            {option.icon}
                        </ToggleButton>
                    ))}
                </CustomToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                <CustomToggleButtonGroup
                    size="small"
                    aria-label="text formatting list"
                    disabled
                    //</MuiBox>={disabled}
                >
                    <ToggleButton value="listNumbered" aria-label="bold">
                        <AddLinkOutlinedIcon fontSize="small" />
                    </ToggleButton>
                </CustomToggleButtonGroup>
            </MuiBox>
        </MuiBox>
    );
}