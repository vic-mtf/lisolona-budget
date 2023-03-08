import {
    Box as MuiBox,
    Paper,
    Stack,
    useTheme
} from '@mui/material';
import Avatar from '../../../../../components/Avatar';
import Typography from '../../../../../components/Typography';
import TextMessage from './text/TextMessage';

export default function MessageBox ({
    isYourself, 
    avatarSrc, 
    content,
    joinBox,
    hideAvatar,
    name, 
    date, 
    type,
    time,
    sended
}) {
    const theme = useTheme();
    const borderRadius = useBorderRadius(1, isYourself, joinBox);
    
    return (
        <MuiBox mt={joinBox ? .25 : 2.5}>
          <MuiBox display="flex">
            <Stack
                direction={isYourself ? 'row-reverse' : "row" }
                spacing={.5}
                display="flex"
                justifyContent={isYourself ? 'right' : 'left'}
                flex={1}
            >
                {!isYourself &&
                <MuiBox
                    display="flex"
                    alignItems="end"
                    width={25}
                >
                    {!hideAvatar &&
                    <Avatar
                        sx={{
                            width: 25,
                            height: 25,
                            border: 'none',
                        }}
                        src={avatarSrc}
                        srcSet={avatarSrc}
                        alt={name}
                    />}
                </MuiBox>}
                <MuiBox maxWidth="70%" position="relative">
                    {!joinBox && 
                    <MuiBox overflow="visible">
                        <Stack 
                            direction="row" 
                            spacing={1} 
                            display="flex" 
                            justifyContent={isYourself ? 'right' : 'left'}
                        >
                            {!isYourself &&
                            <Typography 
                                variant="caption" 
                                color="text.secondary"
                            >{name},</Typography>}
                            <Typography 
                                variant="caption" 
                                color="text.secondary"
                            >{time}</Typography>
                        </Stack>
                    </MuiBox>}
                    <Paper 
                        elevation={0} 
                        sx={{
                            overflow: 'hidden', 
                            background: 'none',
                            borderRadius,
                        }}
                    >
    
                        {type === 'text' &&
                            <TextMessage
                                content={content}
                                bgcolor={isYourself ? 
                                    theme.palette.grey[200] : 
                                'background.paper'}
                                isYourself={isYourself}
                                borderRadius={borderRadius}
                            />
                        }
                    </Paper>
                    <MuiBox
                        position="absolute"
                    ></MuiBox>
                </MuiBox>
            </Stack>
          </MuiBox>
        </MuiBox>
    );
}

export const useBorderRadius = (radius = 1, isYourself, joinBox) => {
    const theme = useTheme();
    return isYourself ? 
    theme.spacing(radius, joinBox ?  0 : radius, 0, radius) : 
    theme.spacing(joinBox ? 0 : radius, radius, radius, 0);
}

MessageBox.defaultProps = {
    type: 'text',
    isYourself: false,
}