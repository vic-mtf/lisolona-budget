import { ClickAwayListener, Fade, Box as MuiBox, Popper, ToggleButton, TextField, Toolbar, DialogActions, Paper } from '@mui/material';
import Typography from '../../../../../../components/Typography';
import IconButton from '../../../../../../components/IconButton';
import Button from '../../../../../../components/Button';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import getSelectedLink from './getSelectedLink';
import  { isCursorOnLink } from './addLink';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

export default function AddLinButton ({editorState, addLink, onFocus, ...otherProps}) {
    const selected = useMemo(() => Boolean(isCursorOnLink(editorState)), [editorState]);
    const [open, setOpen] = useState(false);
    const anchorElRef = useRef();
    const nameRef = useRef();
    const urlRef = useRef();
    const handleSubmit = event => {
        event.preventDefault();
        if(nameRef.current.trim() && urlRef.current?.trim()) {
            const data = {
                name: nameRef.current,
                url: urlRef.current
            };
            onFocus();
            addLink(data);
        }   
        setOpen(false);
    };

    return (
        <>
         <ClickAwayListener
            onClickAway={() => open ? setOpen(false) : null}
         >
            <div
                className={otherProps.className}
            >
                <ToggleButton
                    {...otherProps}
                    ref={anchorElRef}
                    value=""
                    selected={open || selected}
                    title={`${selected ? 'Modidier' : 'Ajouter'} le lien`}
                    onClick={() => setOpen(state => !state)}
                >
                    <AddLinkOutlinedIcon fontSize="small" />
                </ToggleButton>
                <Popper
                    anchorEl={anchorElRef.current}
                    placement="top-end"
                    open={open}
                    transition
                    sx={{zIndex: theme => theme.zIndex.tooltip,}}
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper
                                component="form"
                                onSubmit={handleSubmit}
                                elevation={5}
                                sx={{
                                    background:  theme => theme.palette.background.paper + 
                                    theme.customOptions.opacity,
                                    border:  theme =>  `1px solid ${theme.palette.divider}`,
                                    backdropFilter:  theme =>  `blur(${theme.customOptions.blur})`,
                                    overflow: 'auto',
                                    flexDirection: 'column',
                                    display: 'flex',
                                    gap: 1,
                                    minWidth: 340,
                                    p: 2,
                                    mb: 1,
                                    '& input, & label': {
                                        fontSize: theme => theme.typography.body2.fontSize
                                    },
                                }}
                                 
                            >
                            <Toolbar
                                variant="dense"
                                disableGutters
                                
                            >
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    flexGrow={1}
                                >Ajouter le lien</Typography>
                                <IconButton
                                    onClick={() => setOpen(false)}
                                >
                                    <CloseOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Toolbar>
                             <NavContent
                                setOpen={setOpen}
                                urlRef={urlRef}
                                nameRef={nameRef}
                                editorState={editorState}
                             />
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </div>
        </ClickAwayListener>
        </>
    )
}

const NavContent = ({setOpen, nameRef, urlRef, editorState}) => {
    const data = useMemo(() => getSelectedLink(editorState), [editorState]);
    const [name, setName] = useState(data?.text || '');
    const [url, setUrl] = useState(data?.url || '');
    const onChange = (value, type) => {
        const func = {setName, setUrl}[type];
        if(typeof func === 'function')
            func(value)
    };

    useLayoutEffect(() => {
        nameRef.current = name;
        urlRef.current = url;
    },[name, url, nameRef, urlRef]);

    return (
        <>
        <TextField
            label="Text"
            placeholder="Nom du lien"
            size="small"
            value={name}
            onChange={event => onChange(event.target.value, 'setName')}
            onClick={event => {
                event.stopPropagation();
                event.target.focus()
            }}
            fullWidth
        />  
        <TextField
            label="Lien"
            placeholder="L'adresse du lien"
            value={url}
            onChange={event => onChange(event.target.value, 'setUrl')}
            size="small"
            onClick={event => {
                event.stopPropagation();
                event.target.focus()
            }}
            fullWidth
        />   
        <DialogActions>
            <Button
                onClick={() => setOpen(false)}
            >Annuler</Button>
            <Button
                variant="outlined"
                type="submit"
                onMouseDown={event => event.preventDefault()}
                disabled={!(name.trim() && url.trim())}
            >Enregistrer</Button>
        </DialogActions>
      </>
    )
}