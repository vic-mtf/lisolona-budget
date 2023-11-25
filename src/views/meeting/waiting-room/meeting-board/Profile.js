import  { Box as MuiBox, Stack, Typography, AvatarGroup, Avatar, useTheme } from "@mui/material";
import Button from "../../../../components/Button";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import getFullName from "../../../../utils/getFullName";
import getShort from "../../../../utils/getShort";
import React, { useMemo } from "react";
import { generateColorsFromId } from "../../../../utils/genColorById";
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';


export default function Profile({handleAskJoinMeeting}) {
    const [{target, origin}] = useMeetingData();
    const participants = useMemo(() => origin.participants, [origin]);

    return (
            <Stack
                alignItems="center"
                display="flex"
                spacing={2}
            >
                {target.type === "room" ?
                (
                    <CustomAvatar
                        name={getFullName(target.name)}
                        id={target.id}
                        src={target?.imageUrl}
                        srcSet={target?.imageUrl}
                        variant="rounded"
                        children={<GroupsOutlinedIcon fontSize="large" />}
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
                        origin?.participants.slice(0, 4).map(({identity}) => (
                            <CustomAvatar
                                key={identity?._id}
                                name={getFullName(identity)}
                                src={identity?.imageUrl}
                                srcSet={identity?.imageUrl}
                                id={identity?._id}
                            />
                        ))
                    }
                </AvatarGroup>
                )}
                <Typography
                    variant="body1"
                    align="center"
                    fontWeight="bold"
                >
                {
                    target.type === 'room' ? getFullName(target) :
                    participantsAppel(
                        participants.map(({identity}) => getFullName(identity))
                    )
                }
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleAskJoinMeeting}
                >Joindre la réunion
                </Button>
            </Stack>
    );
}

const CustomAvatar = ({id, name, children, srcSet, src, sx,...otherProps}) => {
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

function participantsAppel(participants) {
    let message = '';
    if (participants.length > 2) {
        const others = participants.length - 2;
        message =`${participants[0]}, ${participants[1]} et ${others} ${others === 1 ? 'autre': 'autres'}`;
    } else if (participants.length === 2) {
        message = participants[0] + ' et ' + participants[1];
    } else if (participants.length === 1) {
        message = participants[0];
    }
    return message;
}