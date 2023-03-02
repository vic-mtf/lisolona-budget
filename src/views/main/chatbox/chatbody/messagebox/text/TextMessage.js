import { Box as MuiBox } from '@mui/material';
import Typography from '../../../../../../components/Typography';
// import { useBorderRadius } from '../MessageBox';
import parse from 'html-react-parser';

export default function TextMessage ({content, bgcolor, borderRadius}) {

    return (
        <MuiBox display="flex">
            <MuiBox display="flex">
                <Typography
                    bgcolor={bgcolor}
                    width="auto"
                    px={3}
                    borderRadius={borderRadius}
                    overflow="hidden"
                    display="flex"
                >
                <div>
                    {parse(content)}
                </div>
                </Typography>
            </MuiBox>
        </MuiBox>
    )
}

TextMessage.defaultProps = {
    bgcolor: 'background.paper',
}