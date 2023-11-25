import React, { useCallback, useMemo } from 'react';
import { Divider, Paper, ToggleButtonGroup as TBG, ToggleButton, alpha, styled } from '@mui/material';
import { GROUPS, COLORS, STYLES } from '../EmojiPicker';
import SettingButton from './SettingButton';
import HeaderAutoHideResize from '../../writing-area/HeaderAutoHideResize';

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

const  EmojiPickerHeader = ({
    onChangeGroup, 
    selectedGroup, 
    color, 
    groupStyle, 
    onChangeGroupStyle, 
    onChangeColor,
    defaultNButton
}) => {
  const toggleButtonGroups = [
    {
        value: [selectedGroup],
        onChange: onChangeGroup,
        onMouseDown: event => event.preventDefault(),
        children: GROUPS.map(group => (
            <CustomToggleButton
                title={group.label}
                value={group.id}
                key={group.id}
            >
                {group.icon}
            </CustomToggleButton>
        )),
    },
    {
        onMouseDown: event => event.preventDefault(),
        children: [(
            <SettingButton
                groupStyle={groupStyle}
                onChangeGroupStyle={onChangeGroupStyle}
                color={color}
                COLORS={COLORS}
                STYLES={STYLES}
                GROUPS={GROUPS}
                onChangeColor={onChangeColor}
            />
        )]
    }
  ];
  return (
    <HeaderAutoHideResize
        toggleButtonGroups={toggleButtonGroups}
        disabled={false}
        defaultNButton={defaultNButton}
    />
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