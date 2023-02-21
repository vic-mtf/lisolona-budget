import { Avatar as MuiAvatar, styled } from "@mui/material";

const Avatar = styled(MuiAvatar)(() => ({
   borderRadius: 8,
}));

Avatar.defaultProps = {
    variant: 'rounded',
}

export default Avatar;