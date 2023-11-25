import { ClickAwayListener, Fade, Paper, Popper, ToggleButton} from '@mui/material';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import React, { useRef, useState } from 'react';
import CustomPaper from './CustomPaper';

export default function MoreOption ({children, disabled, ...otherProps}) {
    const [open, setOpen] = useState(false);
    const anchorElRef = useRef();

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
                    selected={open}
                    title="Plus d'options"
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => setOpen(state => !state)}
                    disabled={disabled}
                >
                    <MoreHorizOutlinedIcon fontSize="small" />
                </ToggleButton>
                <Popper
                    anchorEl={anchorElRef.current}
                    placement="top-start"
                    open={open}
                    transition
                    sx={{zIndex: theme => theme.zIndex.tooltip,}}
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper
                                component="div"
                                sx={{
                                    overflow: 'auto',
                                    flexDirection: 'column',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    background:  theme => theme.palette.background.paper + 
                                    theme.customOptions.opacity,
                                    border:  theme =>  `1px solid ${theme.palette.divider}`,
                                    backdropFilter:  theme =>  `blur(${theme.customOptions.blur})`,
                                }}
                            >
                                <CustomPaper>
                                {
                                    React.Children.toArray(children)
                                    .map(child => React.cloneElement(
                                        child, 
                                        {className: otherProps.className}
                                    ))
                                } 
                                </CustomPaper>
                            </Paper>
                           
                        </Fade>
                    )}
                </Popper>
            </div>
        </ClickAwayListener>
        </>
    )
}