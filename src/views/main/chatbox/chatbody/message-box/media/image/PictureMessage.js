import {
    CardMedia,
    Box as MuiBox,
} from '@mui/material';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useMemo, useState } from 'react';

export default function PictureMessage ({src, srcSet, height, width, minHeight, minWidth}) {
    const [loaded, setLoaded] = useState(false);
    const size = useMemo(() => ({
        ...height ? {height} : {}, 
        ...width ? {width} : {},
        ...minHeight ? {minHeight} : {}, 
        ...minWidth ? {minWidth} : {}, 
    }), [height, width, minHeight, minWidth]);

    return (
        <MuiBox
            display="flex"
            {...size}
            justifyContent="center"
            alignItems="center"
            position="relative"
            overflow="hidden"
        >
            <CardMedia
                component="img"
                srcSet={srcSet}
                src={src}
                loading="lazy"
                onLoad={() => {
                    setLoaded(true);
                }}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: loaded ? null : theme =>  `blur(${theme.customOptions.blur})`,
                }}
            />
            {!loaded &&
            <MuiBox
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                justifyContent="center"
                alignItems="center"
                display="flex"
            >
                <MuiBox
                    display="inline-block"
                    bgcolor="divider"
                    borderRadius={1}
                    sx={{
                        backdropFilter: theme => `blur(${theme.customOptions.blur})`
                    }}
                >
                    <InsertPhotoOutlinedIcon 
                        sx={{color: 'rgba(255,255,255, .8)'}}
                    />
                </MuiBox>
            </MuiBox>}
        </MuiBox>
    );
}

PictureMessage.defaultProps = {
    height: '100%',
    width: '100%',
};