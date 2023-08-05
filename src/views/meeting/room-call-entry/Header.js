import React, { useMemo } from "react";
import Avatar from "../../../components/Avatar";
import { useMeetingData } from '../../../utils/MeetingProvider';
import { generateColorsFromId } from '../../../utils/genColorById';
import { AvatarGroup, useTheme } from '@mui/material';

export default function Header () {
    const [{meetingData}] = useMeetingData();
    const target = useMemo(() => meetingData?.target || null, [meetingData?.target])
    const theme = useTheme();
    const { background, text } = generateColorsFromId(target?.id, theme.palette.mode);

    const avatarSx = useMemo(() => ({
        color: text,
        bgcolor: background,
    }), [background, text]);

    return (
        <React.Fragment>
            <AvatarGroup
                sx={{
                    '& .MuiAvatarGroup-avatar': {
                        border: `2px solid ${theme.palette.background.paper}`
                    },
                    [`& .MuiAvatarGroup-avatar:nth-of-type(2n+1)`]: {
                        top: '-18px',
                        left: '-18px',
                        width: 45,
                        height: 45,
                    },
                    [`& .MuiAvatarGroup-avatar:nth-of-type(2n)`]: {
                        width: 55,
                        height: 55,
                        bottom: '-4px',
                        right: '8px',
                    }
                }}
            >
                <Avatar
                    // src={avatarSrc}
                    // srcSet={avatarSrc}
                    sx={{...avatarSx}}
                />
                <Avatar
                    // src={avatarSrc}
                    // srcSet={avatarSrc}
                   
                    sx={{...avatarSx}}
                />
            </AvatarGroup>
        </React.Fragment>
    );
}