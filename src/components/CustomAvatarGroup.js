import { AvatarGroup, styled } from "@mui/material";

const CustomAvatarGroup = styled(AvatarGroup)(({theme}) => ({
    [`& .MuiAvatarGroup-avatar:nth-child(odd)`]: {
        top: '-5px',
       // left: '-8px',
        width: 22,
        height: 22,
    },
    [`& .MuiAvatarGroup-avatar:nth-child(even)`]: {
        width: 25,
        height: 25,
        bottom: '-2.5px',
        //right: '-8px',
    }
}));

// CustomAvatarGroup.defaultProps = {
//     variant: ''
// }

export default CustomAvatarGroup;