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
import React, { useCallback, useMemo, useRef } from 'react';
import DocMessage from './doc/DocMessage';
import VoiceMessage from './voice/VoiceMessage';

const MessageBox = React.memo(({
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
    medias,
    timeout,
    cover,
    buffer,
    numPages,
    createdAt,
    id,
}) => {
    const theme = useTheme();
    const borderRadius = useBorderRadius(1, isMine, joinBox);
    const urlsRef = useRef([]);

    const createUrl = useCallback((buffer, id) => {
        let url;
        let index = urlsRef.current.findIndex(url => url.id === id);
        if(buffer) {
            if(index > - 1) {
                URL.revokeObjectURL(urlsRef.current[index]?.url);
                url = URL.createObjectURL(buffer);
                urlsRef.current[index] = {url, id};
            } else {
                    url = URL.createObjectURL(buffer);
                    urlsRef.current.push({url, id});
            }
        }
        return url || null;
    }, []);

    const data = useMemo(() => 
        medias?.map((media) => ({
        ...media,
        type: media.subType,
        src: createUrl(media?.buffer, media.id),
    })), [medias, createUrl]);
  
    const setStatus =  useMemo(() => 
        isMine ?
        <MessageState 
            sended={sended} 
            timeout={timeout} 
            createdAt={createdAt}
        /> : null
    , [isMine, sended, createdAt, timeout]);

    const bgColor = useMemo(() => isMine ? 
        theme.palette.grey[200] : theme.palette.background.paper,
    [isMine, theme]);

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
                            bgcolor={bgColor}
                            isMine={isMine}
                            borderRadius={borderRadius}
                        />}
                        {type === 'media' &&
                        <MediaMessage
                            bgcolor={bgColor}
                            isMine={Boolean(setStatus)}
                            borderRadius={borderRadius}
                            type={subType}
                            data={data}
                            sended={sended}
                            id={id}
                        />}
                        {type === 'doc' &&
                        <DocMessage
                            bgcolor={bgColor}
                            isMine={Boolean(setStatus)}
                            borderRadius={borderRadius}
                            type={subType}
                            data={data}
                            content={content}
                            cover={cover}
                            id={id}
                            buffer={buffer}
                            sended={sended}
                            numPages={numPages}
                        />}
                        {type === 'voice' &&
                        <VoiceMessage
                            bgcolor={bgColor}
                            isMine={Boolean(setStatus)}
                            borderRadius={borderRadius}
                            type={subType}
                            content={content}
                            name={name}
                            id={id}
                            buffer={buffer}
                            sended={sended}
                            avatarSrc={avatarSrc}
                        />}
                        {(type !== 'media') && setStatus}
                    </Paper>
                </MuiBox>
            </Stack>
          </MuiBox>
        </MuiBox>
    );
});

MessageBox.defaultProps = {
    type: 'text',
    isMine: false,
};

export default MessageBox;