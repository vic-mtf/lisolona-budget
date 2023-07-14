import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import IconButton from '../../../../../components/IconButton';
import { Stack } from '@mui/material';
import Typography from '../../../../../components/Typography';

export default function RaiseHandButton ({getVideoStream}) {

    return (
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            spacing={.1}
        >
                <IconButton
                    size="small"
                    color="primary"
                    disabled
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                >
                    <BackHandOutlinedIcon/>
                </IconButton>
            {/* <Typography
                noWrap
                fontSize={10.5}
            >
                Lever la main
            </Typography> */}
        </Stack>
    );
}
