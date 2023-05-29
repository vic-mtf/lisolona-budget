import { AvatarGroup, styled } from "@mui/material";

const CustomAvatarGroup = styled(AvatarGroup)(({theme}) => ({
    '& .MuiAvatarGroup-avatar': {
        border: `2px solid ${theme.palette.background.paper}`
    },
    [`& .MuiAvatarGroup-avatar:nth-of-type(2n+1)`]: {
        top: '-6px',
        left: '-15px',
        width: 22,
        height: 22,
    },
    [`& .MuiAvatarGroup-avatar:nth-of-type(2n)`]: {
        width: 25,
        height: 25,
        bottom: '-4px',
        right: '8px',
    }
}));

export default CustomAvatarGroup;