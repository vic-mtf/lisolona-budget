import { Box as MuiBox, createTheme, ThemeProvider, useTheme } from '@mui/material';
import Typography from '../../../../../../components/Typography';
import { useBorderRadius } from '../MessageBox';

export default function TextMessage ({content, bgcolor, borderRadius}) {

    return (
        <MuiBox display="flex">
            <MuiBox display="flex">
                <Typography
                    bgcolor={bgcolor}
                    width="auto"
                    p={3}
                    py={1.5}
                    //display="inline-block"
                    borderRadius={borderRadius}
                    overflow="hidden"
                    display="flex"
                >
                {content}
                </Typography>
            </MuiBox>
        </MuiBox>
    )
}

TextMessage.defaultProps = {
    bgcolor: 'background.paper',
}