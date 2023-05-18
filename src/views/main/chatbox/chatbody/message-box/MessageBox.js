import {
    Box as MuiBox,
    Paper,
    Stack,
    useTheme
} from '@mui/material';
import Avatar from '../../../../../components/Avatar';
import Typography from '../../../../../components/Typography';
import TextMessage from './text/TextMessage';
import MessageState from './MessageState';
import MediaMessage from './media/MediaMessage';
import { useBorderRadius } from './useBorderRadius';
import getServerUri from '../../../../../utils/getServerUri';
export default function MessageBox ({
    isMine, 
    avatarSrc, 
    content,
    joinBox,
    hideAvatar,
    name, 
    type,
    sended,
    time,
    subType,
    medias
}) {
    const theme = useTheme();
    const borderRadius = useBorderRadius(1, isMine, joinBox);
    if(medias)
        console.log(medias?.map((media) => ({
            ...media,
            src: getServerUri({pathname: media.content}),
            type: media.subType,
        }))
        )
    return (
        <MuiBox
            component="div"
            style={{marginTop: joinBox ? '1px' : '5px'}}
        >
          <MuiBox display="flex">
            <Stack
                direction={isMine ? 'row-reverse' : "row" }
                display="flex"
                spacing={.5}
                justifyContent={isMine ? 'right' : 'left'}
                flex={1}
            >
                {!isMine &&
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
                <MuiBox maxWidth="80%" position="relative">
                    {!joinBox && 
                    <MuiBox overflow="visible">
                        <Stack 
                            direction="row" 
                            spacing={1} 
                            display="flex" 
                            justifyContent={isMine ? 'right' : 'left'}
                        >
                            {!isMine &&
                            <Typography variant="caption" color="text.secondary" >{name},</Typography>}
                            <Typography variant="caption" color="text.secondary">{time}</Typography>
                        </Stack>
                    </MuiBox>}
                    <Paper 
                        elevation={0} 
                        position="relative"
                        sx={{
                            overflow: 'hidden', 
                            background: 'none',
                            borderRadius,
                            zIndex: 0,
                            width: "100%"
                        }}
                    >
                        {type === 'text' &&
                        <TextMessage
                            content={content}
                            bgcolor={isMine ? 
                                theme.palette.grey[200] : 
                                theme.palette.background.paper
                            }
                            isMine={isMine}
                            borderRadius={borderRadius}
                        />}
                        {type === 'media' &&
                        <MediaMessage
                            bgcolor={isMine ? 
                                theme.palette.grey[200] : 
                                theme.palette.background.paper
                            }
                            isMine={isMine}
                            borderRadius={borderRadius}
                            type={subType}
                            data={
                                medias?.map((media) => ({
                                    ...media,
                                    src: getServerUri({pathname: media.content}),
                                    type: media.subType,
                                }))
                            }
                        />}
                        {isMine && <MessageState sended={sended} />}
                    </Paper>
                </MuiBox>
            </Stack>
          </MuiBox>
        </MuiBox>
    );
}


MessageBox.defaultProps = {
    type: 'text',
    isMine: false,
}