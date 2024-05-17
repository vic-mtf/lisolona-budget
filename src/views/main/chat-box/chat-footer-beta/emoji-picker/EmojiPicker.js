import React, { useCallback, useMemo, useState } from 'react'
import { Divider, Box as MuiBox, Paper, Stack } from '@mui/material';
import EmojiPickerContent from './content/EmojiPickerContent';
import _ASSETS_INFO from './assets_info.json';
import EmojiPickerHeader from './header/EmojiPickerHeader';
import EmojiTransportationOutlinedIcon from '@mui/icons-material/EmojiTransportationOutlined';
import SportsSoccerOutlinedIcon from '@mui/icons-material/SportsSoccerOutlined';
import TapasOutlinedIcon from '@mui/icons-material/TapasOutlined';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import EmojiSymbolsOutlinedIcon from '@mui/icons-material/EmojiSymbolsOutlined';
import EmojiNatureOutlinedIcon from '@mui/icons-material/EmojiNatureOutlined';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import SportsKabaddiOutlinedIcon from '@mui/icons-material/SportsKabaddiOutlined';
import SportsScoreOutlinedIcon from '@mui/icons-material/SportsScoreOutlined';
import { useDefaultNumButtonSizeByRoot } from '../writing-area/HeaderAutoHideResize';


export default function EmojiPicker ({ onSelect })  {
    const [color, setColor] = useState(COLORS[0]);
    const [style, setStyle] = useState(STYLES[2].id);
    const [group, setGroup] = useState(GROUPS[2].id);
    const data = useMemo(() => getEmojisData(group, color, style), [group, style, color]);
    const [nButton, headerRef] = useDefaultNumButtonSizeByRoot();

    const handleChangeGroup = useCallback((event, newValues) => {
        const [, value] = newValues;
        if(newValues.length) setGroup(value);
    }, []);

    const handleChangeColor = useCallback((event, newValues) => {
        console.log(newValues);
        const [, value] = newValues;
        if(newValues.length) setColor(value);
    }, []);

    const handleChangeGroupStyle = useCallback((event, newValues) => {
        const [, value] = newValues;
        if(newValues.length) setStyle(value);
    }, []);

    return (
        <MuiBox
            display="flex"
            width="100%"
        >
            <Paper
                elevation={2}
                sx={{
                    bgcolor: 'background.paper',
                    width: '100%',
                    borderRadius: 0,
                }}
            >
                <Stack
                    divider={<Divider/>}
                    ref={headerRef}
                >
                    <EmojiPickerHeader
                        onChangeGroup={handleChangeGroup}
                        selectedGroup={group}
                        groupStyle={style}
                        onChangeGroupStyle={handleChangeGroupStyle}
                        color={color}
                        onChangeColor={handleChangeColor}
                        defaultNButton={nButton}
                        key={nButton ? 0 : 1}
                    />
                    <EmojiPickerContent
                        onSelect={onSelect}
                        data={data}
                        key={group}
                    />
                </Stack>
            </Paper>
        </MuiBox>
    )
}

export const getEmojisData = (group=GROUPS[0].id, style=COLORS[0], type=STYLES[2]) => {
    const data = _ASSETS_INFO.data.filter(({metadata}) => metadata.group === group);
    return data.map(data => {
        const styled = Boolean(data.styles);
        let src = styled ? data.sources[style][type] : data.sources[type];
        const { metadata, name } = data;
        return {metadata, src, name};
    });
};

export function getCharacterFromCode(code) {
    return String.fromCodePoint(parseInt(code, 16));
}

export function getCharacterFromCodeString(codeString) {
    return codeString.replace(/\\u([a-fA-F0-9]{4})/g, 
        (match, group) => String.fromCodePoint(parseInt(group, 16))
    );
  }

export const COLORS = ['Default', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];

export const GROUPS = [
    {
        id:'Objects',
        label: '',
        icon: <EmojiObjectsOutlinedIcon fontSize="small" />
    },
    {
        id:'People & Body',
        label: '',
        icon: <SportsKabaddiOutlinedIcon fontSize="small" />
    },
    {
        id:'Smileys & Emotion',
        label: '',
        icon: <SentimentVerySatisfiedOutlinedIcon fontSize="small" />
    },
    {
        id:'Animals & Nature',
        label: '',
        icon: <EmojiNatureOutlinedIcon fontSize="small" />
    },
    {
        id:'Food & Drink',
        label: '',
        icon: <TapasOutlinedIcon fontSize="small" />
    },
    {
        id:'Symbols',
        label: '',
        icon: <EmojiSymbolsOutlinedIcon fontSize="small" />
    },
    {
        id:'Travel & Places',
        label: '',
        icon: <EmojiTransportationOutlinedIcon fontSize="small" />
    },
    {
        id:'Activities',
        label: '',
        icon: <SportsSoccerOutlinedIcon fontSize="small" />
    },
    {
        id:'Flags',
        label: '',
        icon: <SportsScoreOutlinedIcon fontSize="small" />
    },
];

export const STYLES = [
    {
        id: "3D",
        label: '3D',
    }, 
    {
        id: "Color",
        label: 'Couleur',
    }, 
    {
        id: "Flat",
        label: 'Plat',
    }, 
    // {
    //     id: "High Contrast",
    //     label: 'Contraste élevé',
    // }
];