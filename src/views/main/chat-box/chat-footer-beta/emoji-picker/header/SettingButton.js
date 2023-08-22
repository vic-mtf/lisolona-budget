import {  styled, 
    ToggleButtonGroup as TBG, 
    ClickAwayListener, Fade, 
    Box as MuiBox, 
    Popper, ToggleButton, 
    TextField, Toolbar, 
    DialogActions, 
    Paper, 
    FormControl, 
    FormLabel, 
    RadioGroup, 
    FormControlLabel, 
    Radio 
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

export default function SettingButton ({groupStyle, onChangeColor, onChangeGroupStyle, color, COLORS, STYLES, GROUPS,  ...otherProps}) {
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
                                >Parametre emoji</Typography>
                                <IconButton
                                    onClick={() => setOpen(false)}
                                >
                                    <CloseOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Toolbar>
                             <RowRadioButtonsGroup
                                value={groupStyle}
                                onChange={onChangeGroupStyle}
                                data={STYLES}
                                formLabel="Styles"
                             /> 
                            <FormLabel id="colors">Couleurs</FormLabel>
                            <ToggleButtonGroup
                                color="primary"
                                value={[color]}
                                onChange={onChangeColor}
                            >
                                {getEmojiColors(COLORS).map(color => (
                                    <CustomToggleButton
                                        value={color.id}
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

function RowRadioButtonsGroup({onChange, value, data, formLabel}) {
    return (
      <FormControl>
        <FormLabel id="emoji-style"
        >{formLabel}</FormLabel>
        <RadioGroup
          row
          aria-labelledby="emoji-style"
          name="emoji-style-radio-buttons-group"
          value={value}
          onChange={onChange}
        >
            {
                data.map((button) => (
                    <FormControlLabel 
                        key={button.id} 
                        value={button.id} 
                        control={<Radio value={button.id} size="small" />} 
                        label={button.label}
                        disableTypography
                     />
                ))
            }
        </RadioGroup>
      </FormControl>
    );
}

const getEmojiColors = COLORS => COLORS.map((id) => {
    const imageData = getEmojisData('People & Body', id, 'Flat').find(({metadata}) => metadata.unicode === "1f91a")
    console.log(imageData);
    const label = (
        <img 
            src={imageData.src} 
            height={20}
            width={20}
            alt={getCharacterFromCodeString(imageData.metadata.glyph)} 
        />
    );
    return {
        id,
       label,
        ...imageData,
    };
})