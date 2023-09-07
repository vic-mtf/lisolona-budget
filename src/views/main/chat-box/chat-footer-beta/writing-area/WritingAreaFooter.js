import React from 'react';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import { WritingAreaToolbar } from './WritingArea';
import { Paper, ToggleButtonGroup as TBG, alpha, styled, Box as MuiBox, Fab } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import IconButton from '../../../../../components/IconButton';
import ToggleToolbarButton from './buttons/ToggleToolbarButton';
import ToggleEmojiBarButton from './buttons/ToggleEmojiBarButton';
import VoiceRecordButton from './buttons/VoiceRecordButton';
import AddFilesButton from './buttons/AddFilesButton';

export const ToggleButtonGroup = styled(TBG)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        //margin: theme.spacing(0.5),
        border: `.01px solid transparent`,
        '&.Mui-disabled': { border: `.01px solid transparent`},
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

export const CustomPaper = styled(props => (
    <Paper
        elevation={0}
        {...props}
    />)
    )(({ theme }) => ({
    display: 'flex',
    background: alpha(
        theme.palette.common[ 
            theme.palette.mode === 'light' ? 
            'black' : 'white'
    ], 0.08
    ),
    flexWrap: 'wrap',
}));



ToggleButtonGroup.defaultProps = {
    size: 'small',
    onMouseDown: event => event.preventDefault(),
    onMouseUp: event => event.preventDefault()
}

const  WritingAreaFooter = ({editor, hasFocusRef, isEmpty, filesRef}) => {
   
    return (
        <WritingAreaToolbar>
        {
            () => (
                <MuiBox
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: .5,
                    }}
                    onMouseDown={event => event.preventDefault()}
                    onMouseUp={event => event.preventDefault()}
                >
                    <MuiBox
                        sx={{
                            flexGrow: 1,
                            gap: .5,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            //justifyContent: 'center',
                        }}
                    >
                        <VoiceRecordButton/>
                        <ToggleToolbarButton/>
                        <ToggleEmojiBarButton/>
                        <AddFilesButton filesRef={filesRef}/>
                    </MuiBox>
                    <Fab
                        size="small"
                        variant="circular"
                        color="primary"
                        sx={{
                            borderRadius: 1,
                        }}
                        disabled={isEmpty}
                    >
                        <SendOutlinedIcon fontSize="small" />
                    </Fab>
                </MuiBox>
            )
        }
        </WritingAreaToolbar>
    );
}

export default WritingAreaFooter;

// !getTextFromEditorState(editorState).trim()