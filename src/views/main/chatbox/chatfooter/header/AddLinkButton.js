import React, { useRef } from 'react';
import {
    ClickAwayListener,
    DialogActions,
    Fade,
    Paper,
    Popper,
    TextField,
    ToggleButton,
} from '@mui/material';
import InputControler from '../../../../../components/InputControler';
import CustomToggleButtonGroup from '../../../../../components/CustomToggleButtonGroup';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import Button from '../../../../../components/Button';
import addLinkAction from './addLinkAction';
import getEntity from './getEntity';
import { useFooterContext } from '../ChatFooter';

export default function AddLinkButton () {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [{editorState}, {handleChange}] = useFooterContext();
    const urlRef = useRef();
    const textRef = useRef();
    const setFocus = event => event.target.focus();
    const {selectedText, url} = getEntity(editorState);

    const handleClick = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    
    return (
        <React.Fragment>
            <CustomToggleButtonGroup
                size="small"
                aria-label="add-link"
                variant="contained" 
                onMouseDown={event => event.preventDefault()}
            >
                <ToggleButton 
                    value="listNumbered" 
                    aria-label="bold"
                    onClick={handleClick}
                    selected={open}
                    onMouseDown={event => event.preventDefault()}
                >
                    <AddLinkOutlinedIcon fontSize="small" />
                </ToggleButton>
            </CustomToggleButtonGroup>
            
                <Popper 
                    open={open} 
                    anchorEl={anchorEl} 
                    transition
                    sx={{
                        zIndex: theme => theme.zIndex.tooltip,
                    }}
                    placement="top-start"
                >
                    {({ TransitionProps }) => (
                    <ClickAwayListener
                        onClickAway={handleClose}
                    >
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper
                                sx={{
                                    p: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    width: 300,
                                    '& div, & input': {
                                        fontSize: theme => theme.typography.body2.fontSize
                                    }
                                }}
                                component="form"
                                elevation={5}
                            >
                                <InputControler
                                    valueRef={textRef}
                                    margin="dense"
                                    fullWidth
                                    label="Nome"
                                    trim={false}
                                    defaultValue={selectedText}
                                >
                                    <TextField
                                        label="Text"
                                        onClick={setFocus}
                                    />
                                </InputControler>
                                <InputControler
                                    valueRef={urlRef}
                                    type="url"
                                    margin="dense"
                                    label="adress"
                                    fullWidth
                                    defaultValue={url}
                                >
                                    <TextField
                                        label="adresse"
                                        onClick={setFocus}
                                        placeholder='https://example.com'
                                    />
                                </InputControler>
                                <DialogActions>
                                    <Button
                                        children="Annuler"
                                        onClick={handleClose}
                                    />
                                    <Button
                                        children="Enregister"
                                        variant="outlined"
                                        type="submit"
                                        onClick={event => {
                                            event.preventDefault();
                                            const { current: linkUrl } = urlRef;
                                            const { current: displayLink } = textRef;
                                            if(linkUrl?.trim() && displayLink?.trim())
                                                addLinkAction({
                                                    editorState,
                                                    setEditorState: handleChange,
                                                    linkUrl: urlRef.current,
                                                    displayLink: textRef.current
                                                });
                                             handleClose(event);
                                        }}
                                    />
                                </DialogActions>
                            </Paper>
                        </Fade>
                    </ClickAwayListener>
                    )}
                </Popper>
        </React.Fragment>
    )
}