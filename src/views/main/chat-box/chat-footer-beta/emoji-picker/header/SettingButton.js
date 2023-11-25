import {  styled, 
    ToggleButtonGroup as TBG, 
    ClickAwayListener, Fade, 
    //Box as MuiBox, 
    Popper, ToggleButton, 
    Toolbar,  
    Paper, 
    FormLabel
} from '@mui/material';
import Typography from '../../../../../../components/Typography';
import IconButton from '../../../../../../components/IconButton';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useRef, useState } from 'react';
import { getEmojisData, getCharacterFromCodeString } from '../EmojiPicker';
import { CustomToggleButton } from './EmojiPickerHeader';

export const ToggleButtonGroup = styled(TBG)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0, 0.125, 0, 0.125),
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

export default function SettingButton ({
    groupStyle, 
    onChangeColor, 
    onChangeGroupStyle, 
    color, 
    COLORS, 
    STYLES, 
    GROUPS,  
    ...otherProps
}) {
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
                    title=""
                    onClick={() => setOpen(state => !state)}
                >
                    <SettingsOutlinedIcon fontSize="small" />
                </ToggleButton>
                <Popper
                    anchorEl={anchorElRef.current}
                    placement="top-end"
                    open={open}
                    transition
                    sx={{zIndex: theme => theme.zIndex.tooltip,}}
                    onMouseDown={event => event.preventDefault()}
                >
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper
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
                                >Paramètre emoji </Typography>
                                <IconButton
                                    onClick={() => setOpen(false)}
                                >
                                    <CloseOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Toolbar>
                             <FormLabel id="colors">Style</FormLabel>
                            <ToggleButtonGroup
                                color="primary"
                                value={[groupStyle]}
                                onChange={onChangeGroupStyle}
                            >
                                {getEmojiStyles(STYLES).map(color => (
                                    <CustomToggleButton
                                        value={color?.id}
                                        key={color?.id}
                                        sx={{
                                            m: 0,
                                            p: .5
                                        }}
                                    >{color.label}</CustomToggleButton>
                                ))}
                            </ToggleButtonGroup>
                            <FormLabel id="colors">Couleur</FormLabel>
                            <ToggleButtonGroup
                                color="primary"
                                value={[color]}
                                onChange={onChangeColor}
                            >
                                {getEmojiColors(COLORS).map(color => (
                                    <CustomToggleButton
                                        value={color.id}
                                        key={color.id}
                                        sx={{
                                            m: 0,
                                            p: .5
                                        }}
                                    >{color.label}</CustomToggleButton>
                                ))}
                            </ToggleButtonGroup>
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </div>
        </ClickAwayListener>
        </>
    )
}

const getEmojiColors = COLORS => COLORS.map((id) => {
    const imageData = getEmojisData('People & Body', id, 'Flat')
    .find(({metadata}) => metadata.unicode === "1f91a");
   
    const label = (
        <div 
            style={{
                height: 30,
                width: 30,
                backgroundImage: `url("${imageData.src}")`,
                backgroundSize: '100%',
                color: 'transparent',
            }} 
            children={getCharacterFromCodeString(imageData.metadata.glyph)} 
            title={{
                "Default": "Par Défaut",
                "Light": "claire", 
                "Medium-Light": "moyennement claire", 
                "Medium": "moyenne", 
                "Medium-Dark": "moyennement foncée",
                "Dark":"foncée"
            }[id]}
        />
    );
    return { id, label, ...imageData };
});

const getEmojiStyles = STYLES => STYLES.map(({id:style}) => {
    const imageData = getEmojisData('Activities', 'Default', style)
    .find(({metadata}) => metadata.unicode === "1f380");

    const label = (
        <div 
            style={{
                height: 30,
                width: 30,
                backgroundImage: `url("${imageData.src}")`,
                backgroundSize: '100%',
                color: 'transparent',
            }} 
            children={getCharacterFromCodeString(imageData.metadata.glyph)} 
            title={{
                "3D": "3d",
                "Color": "Coloré",
                "Flat": "Plat"
            }[style]}
        />
    );
    return { id: style, label, ...imageData };
});