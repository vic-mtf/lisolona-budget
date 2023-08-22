import React, { useCallback, useMemo } from 'react';
import { Divider, Paper, ToggleButtonGroup as TBG, ToggleButton, alpha, styled } from '@mui/material';
import { GROUPS, COLORS, STYLES } from '../EmojiPicker';
import SettingButton from './SettingButton';

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
 
export const CustomPaper = styled(props => (
    <Paper
        elevation={0}
        {...props}
    />)
    )(({ theme }) => ({
    display: 'flex',
    borderRadius: 0,
    padding: theme.spacing(0.5, 0, 0.5, 0),
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

const  EmojiPickerHeader = ({onChangeGroup, selectedGroup, color, groupStyle, onChangeGroupStyle, onChangeColor}) => {

  return (
    <CustomPaper>
        <ToggleButtonGroup
            value={[selectedGroup]}
            onChange={onChangeGroup}
        >
            {
                GROUPS.map(group => (
                    <CustomToggleButton
                        title={group.label}
                        value={group.id}
                        key={group.id}
                    >
                        {group.icon}
                    </CustomToggleButton>
                ))
            }
        </ToggleButtonGroup>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
        <ToggleButtonGroup>
            <SettingButton
                groupStyle={groupStyle}
                onChangeGroupStyle={onChangeGroupStyle}
                color={color}
                COLORS={COLORS}
                STYLES={STYLES}
                GROUPS={GROUPS}
                onChangeColor={onChangeColor}
            />
        </ToggleButtonGroup>
    </CustomPaper>
  );
}

export const CustomToggleButton = (props) => {
    return (
        <div className={props.className}> 
             <ToggleButton  {...props}/>
        </div>
    );
};
export default EmojiPickerHeader;