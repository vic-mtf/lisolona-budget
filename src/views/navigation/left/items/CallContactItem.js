import { 
    ListItemButton, 
    ListItemAvatar, 
    ListItemText,
    Menu,
    ListItem,
    Zoom,
    Stack,
    Tooltip,
    useTheme
} from "@mui/material";
import React from "react";
import Avatar from "../../../../components/Avatar";
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import PhoneMissedOutlinedIcon from '@mui/icons-material/PhoneMissedOutlined';
import MissedVideoCallOutlinedIcon from '@mui/icons-material/MissedVideoCallOutlined';
import PhoneCallbackOutlinedIcon from '@mui/icons-material/PhoneCallbackOutlined';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import capStr from '../../../../utils/capStr';
import IconButton from "../../../../components/IconButton";
import Typography from "../../../../components/Typography";
import CustomBadge from "../../../../components/CustomBadge";
import CustomAvatarGroup from "../../../../components/CustomAvatarGroup";
import AvatarStatus from "../../../../components/AvatarStatus";
import timeHumanReadable from "../../../../utils/timeHumanReadable";

// type = incoming | outgoing | missed
// format = audio | video

export default function CallContactItem ({call}) {
    const {
        avatarSrc, 
        name, 
        date, 
        type, 
        id, 
        count, 
        createdAt, 
        format, 
        callsInfos,
        avatarsSrc,
    } = call;
    const [contextMenu, setContextMenu] = React.useState(null);

    const handleContextMenu = event => {
        event.preventDefault();
        const mouseX = event.clientX + 2;
        const mouseY = event.clientY - 6;
        setContextMenu(
            contextMenu === null ? {mouseX, mouseY} : null,
        );
    };

    return (
        <React.Fragment>
            <ListItem
                disablePadding
                // secondaryAction={
                //     <Tooltip 
                //         title="Relancer l'appel"
                //         arrow
                //     >   <div>  
                //             <IconButton
                //                 disabled
                //             >
                //                 <LocalPhoneOutlinedIcon fontSize="small"/>
                //             </IconButton>
                //         </div>
                //     </Tooltip>   
                // }
            >
                <ListItemButton 
                    sx={{overflow: 'hidden'}}
                    onContextMenu={handleContextMenu}
                >
                <ListItemAvatar>
                
                    <AvatarStatus
                        avatarSrc={avatarSrc}
                        avatarsSrc={avatarsSrc}
                        invisible
                        id={id}
                        name={name}
                        type={type}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={
                        <Stack 
                            spacing={1} 
                            direction="row" 
                            display="flex" 
                            alignItems="center"
                        >
                            <Typography variant="caption">({count})</Typography>
                            <Typography variant="caption" color="text.secondary" >
                                {capStr(timeHumanReadable(createdAt, true, {
                                    showDetail: true
                                }))}
                            </Typography>  
                        </Stack>
                    }
                    primaryTypographyProps={{
                        component: 'div', 
                        noWrap: true,
                        title: name,
                        color: 'text.primary',
                        //variant: 'caption',
                    }}
                    secondaryTypographyProps={{
                        component: "div",
                        noWrap: true,
                        title: date, 
                        color: "text.secondary",
                        variant: 'caption',
                    }}
                />
                </ListItemButton>
            </ListItem>
            <Menu
                open={contextMenu !== null}
                onClose={() => setContextMenu(null)}
                anchorReference="anchorPosition"
                anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }
                PaperProps={{
                    sx: {
                        bgcolor: theme => theme.palette.background.paper + 
                        theme.customOptions.opacity,
                        border: theme => `1px solid ${theme.palette.divider}`,
                        backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                        height: 200,
                        width: 200,
                        overflow: 'auto',
                    }
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            ></Menu>
        </React.Fragment>
    )
}

// const useCallParams = (type="missed", format="video") => {
//     const isMissed = type === 'missed';
//     const theme = useTheme();

//     return ({
//         color: theme.palette[isMissed ? 'error' : 'success']?.main,
//         iconFormat: format === 'audio' ? 
//             <LocalPhoneOutlinedIcon fontSize="small"/>:
//             <VideocamOutlinedIcon fontSize="small"/>
//         ,
//         iconCallType: isMissed ? (<PhoneMissedOutlinedIcon fontSize="inherit"/> ) :
//          (
//             type === 'incoming' ? 
//             <PhoneCallbackOutlinedIcon fontSize="inherit"/> :
//             <CallMadeOutlinedIcon fontSize="inherit"/>
//         )
//     });
// }
