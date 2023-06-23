import { Box as MuiBox, Stack } from '@mui/material';
import FooterOptions from './FooterOptions';
import FooterButtons from './FooterButtons';
import { useRef } from 'react';
import { grey } from '@mui/material/colors';

export default function CheckingDevice () {
    const videoRef = useRef();
    
    return (
        <Stack
            spacing={1}
            display="flex"
            justifyContent="center"
            flex={1}
        >
            <MuiBox
                position="relative"
                display="flex"
                alignItems="end"
                width="100%"
                height={280}
                borderRadius={1}
                sx={{
                    "& video": {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        bgcolor: grey[900],
                        borderRadius: 1,
                        transform: 'scaleX(-1)',
                        border: theme => `1px solid ${theme.palette.divider}`
                    }
                }}
            >
                <video
                    ref={videoRef}
                    muted
                    autoPlay
                />
                <FooterButtons
                    videoRef={videoRef}
                />
            </MuiBox>
            <FooterOptions/>
        </Stack>
    );
}