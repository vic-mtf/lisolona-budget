import React, {  useLayoutEffect, useMemo, useRef, useState } from 'react';
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import { Divider, Paper, ToggleButtonGroup as TBG, alpha, styled } from '@mui/material';
import MoreOption from './buttons/MoreOption';

export default function  HeaderAutoHideResize ({ toggleButtonGroups, defaultNButton, disabled }) {
    const rootRef = useRef();
    const [buttons, setButtons] = useState(defaultNButton || 0);
    const [toggleButtonShows, toggleButtonHides] = useMemo(() => {
        const nButtonGroups = toggleButtonGroups.map(buttons => buttons.children)?.flat().length;
        return filterObjects(
            toggleButtonGroups, 
            nButtonGroups >= buttons ?
            nButtonGroups - buttons + 1 : 0
        );
    }, [toggleButtonGroups, buttons]);

  useLayoutEffect(() => {
    const handleResize = event => {
        const root = rootRef.current;
        if(root) {
            const width = parseFloat(window.getComputedStyle(root).width);
            const currentButtonGroups = Math.floor(width / 42);
            if(buttons !== currentButtonGroups)
                setButtons(currentButtonGroups);
        }
    }

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
  }, [toggleButtonGroups, buttons]);
  
  return (
    <CustomPaper
        ref={rootRef}
        sx={{ flexWrap: 'nowrap' }}
    >
        {toggleButtonShows.map(({ children, ...props }, index, {length})  => (
            <React.Fragment key={index}>
                <ToggleButtonGroup
                    {...props}
                    size="small"
                    sx={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        flexGrow: length - 1 === index ? 1 : 'inherit',
                    }}
                >{React.Children.toArray(children)}</ToggleButtonGroup>
                {length - 1 !== index &&
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />}
            </React.Fragment>
        ))}
        {Boolean(toggleButtonHides?.length) &&
        <ToggleButtonGroup
            size="small"
        >
            <MoreOption
                disabled={disabled}
            >
                {toggleButtonHides.map(({children, ...props}, index, {length})  => (
                <React.Fragment key={index}>
                    <ToggleButtonGroup
                        {...props}
                        orientation="horizontal"
                        size="small"
                    >{React.Children.toArray(children)}</ToggleButtonGroup>
                    {length - 1 !== index &&
                    <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />}
                </React.Fragment>
            ))}
            </MoreOption>
        </ToggleButtonGroup>}
    </CustomPaper>

  );
}

export const ToggleButtonGroup = styled(TBG)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0, 0.125, 0, 0.125),
        border: `.01px solid transparent`,
        flexWrap: "nowrap",
        '&.Mui-disabled': { border: `.01px solid transparent`},
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

export const CustomPaper = styled(React.forwardRef((props, ref) => (
    <Paper
        elevation={0}
        component="div"
        {...props}
        ref={ref}
    />))
    )(({ theme }) => ({
    display: 'flex',
    borderRadius: 0,
    padding: theme.spacing(0.25),
    background: alpha(
        theme.palette.common[ 
            theme.palette.mode === 'light' ? 
            'black' : 'white'
    ], 0.08
    ),
    flexWrap: 'wrap',
}));

function filterObjects(array, number) {
    let shows = [];
    let hides = [];
    let filter = number;
    [...array].reverse().forEach(obj => {
            const length = obj?.children?.length;
            if(length <= filter && filter) 
                hides.push(obj);
            if(length > filter) {
                shows.push({
                    ...obj,
                    children: obj.children?.slice(0, length - filter),
                });
                if(filter)
                    hides.push({
                        ...obj,
                        children: obj.children?.slice(-filter),
                    });
            }
            filter = (filter - length) <= 0 ? 0 : (filter - length)
    });
    return [shows.reverse(), hides.reverse()];
}

export const useDefaultNumButtonSizeByRoot = () => {
    const [nButton, setNButton] = useState(0);
    const rootRef = useRef();
    useLayoutEffect(() => {
        const root = rootRef.current;
        if(root) {
            const width = parseFloat(
                window.getComputedStyle(root, null).width
            );
            setNButton(Math.floor(width / 42));
        }
    },[]);
    return [nButton, rootRef];
};