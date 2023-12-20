import {
    Box as MuiBox,
    useTheme,
    Avatar,
    Stack,
    AvatarGroup
} from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import React, { useMemo, useState } from 'react';
import { generateColorsFromId } from '../../../../../utils/genColorById';
import getFullName from '../../../../../utils/getFullName';
import getShort from '../../../../../utils/getShort';
import Typography from '../../../../../components/Typography';



export default function Profile ({target}) {
    const participants = useMemo(() => target?.members, [target]);
    const isSingle = useMemo(() => 
        target?.type === "direct"  ? participants?.length === 2 : target?.type === 'room', 
        [participants, target]
    );
    return (
        <MuiBox
            overflow="hidden"
            display="flex"
            position="relative"
            sx={{zIndex: theme => theme.zIndex.drawer}}
            flex={1}
            width="100%"
            height="calc(100vh - 250px)"
            justifyContent="center"
            alignItems="center"
        >
            <Stack
                alignItems="center"
                display="flex"
                spacing={1}
                px={1}
            >
                {isSingle ?
                (
                    <CustomAvatar
                        name={getFullName(target.name)}
                        id={target.id}
                        src={target?.imageUrl || target?.avatarSrc}
                        srcSet={target?.imageUrl || target?.avatarSrc}
                        variant="rounded"
                        children={
                            target.type === 'room' ?
                            (<GroupsOutlinedIcon fontSize="large" />):
                            getShort(getFullName(target.name))
                        }
                        sx={{
                            height: 60,
                            width: 60,
                        }}
                    />
                ) :
                (
                <AvatarGroup
                    total={participants?.length}
                    variant="rounded"
                    sx={{
                        '& .MuiAvatarGroup-avatar': {
                            width: 60,
                            height: 60 
                        }
                    }}
                >
                    {
                        participants.slice(0, 4).map(({identity, _id}) => {
                            const participant = {...identity, ..._id};
                            return (
                                <CustomAvatar
                                    key={participant?._id}
                                    name={getFullName(participant)}
                                    src={participant?.imageUrl}
                                    srcSet={participant?.imageUrl}
                                    id={participant?._id}
                                />
                            );
                        })
                    }
                </AvatarGroup>
                )}
                <Typography
                    variant="body1"
                    align="center"
                    fontWeight="bold"
                    px={1}
                >
                {
                   isSingle ? getFullName(target) : 
                    participantsAppel(
                        participants.map(({identity, _id}) => getFullName({...identity, ..._id}))
                    )
                }
                </Typography>
                <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    title={target?.description}
                    maxWidth="100%"
                    px={10}
                    align="center" 
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {target?.description}
                </Typography>
            </Stack>
    
        </MuiBox>
    );
}


export const CustomAvatar = ({id, name, children, srcSet, src, sx,...otherProps}) => {
    const theme = useTheme();
    const { background, text } = useMemo(() => generateColorsFromId(id, theme.palette.mode), [theme, id]) ;
    const avatarSx = useMemo(() => ({
        ...sx,
        color: text,
        bgcolor: background,
        fontWeight: 'bold',
        fontSize: 15,
    }), [background, text, sx]);

    return (
        <Avatar 
            {...otherProps}
            children={children || getShort(name, 2) || undefined}
            alt={name}
            srcSet={srcSet || src}
            sx={avatarSx}
            src={src}
            imgProps={{
                loading: 'lazy'
            }}
        />
    );
};

export function participantsAppel(participants) {
    let message = '';
    if (participants.length > 2) {
        const others = participants.length - 2;
        message =`${participants[0]}, ${participants[1]} et ${others} ${others === 1 ? 'autre': 'autres'}`;
    } else if (participants.length === 2) 
        message = participants[0] + ' et ' + participants[1];
    else if (participants.length === 1) 
        message = participants[0];
    return message;
}