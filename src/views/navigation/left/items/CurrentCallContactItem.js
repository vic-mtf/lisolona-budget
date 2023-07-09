import { 
    ListItemButton, 
    ListItemAvatar, 
    ListItemText,
    // Menu,
    ListItem,
    // Zoom,
    Stack,
    // Tooltip,
    useTheme
} from "@mui/material";
import React from "react";
// import Avatar from "../../../../components/Avatar";
// import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
// import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
// import PhoneMissedOutlinedIcon from '@mui/icons-material/PhoneMissedOutlined';
// import MissedVideoCallOutlinedIcon from '@mui/icons-material/MissedVideoCallOutlined';
// import PhoneCallbackOutlinedIcon from '@mui/icons-material/PhoneCallbackOutlined';
// import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import capStr from '../../../../utils/capStr';
// import IconButton from "../../../../components/IconButton";
import Typography from "../../../../components/Typography";
import CustomBadge from "../../../../components/CustomBadge";
// import CustomAvatarGroup from "../../../../components/CustomAvatarGroup";
import AvatarStatus from "./AvatarStatus";
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import { useDispatch } from "react-redux";
import { addTeleconference } from "../../../../redux/teleconference";
// type = incoming | outgoing | missed
// format = audio | video

export default function CurrentCallContactItem (props) {
    const {
        avatarSrc, 
        name, 
        date, 
        type, 
        format, 
        id,
    } = props;
    const [contextMenu, setContextMenu] = React.useState(null);
    const {iconCallType, color } = useCallParams(type, format);
    const dispatch  = useDispatch();
    const calls = (
        <Typography 
        component="span" 
        variant="caption" 
        color="text.primary"
        >(Appel en cours)</Typography>
        )

    const handleContextMenu = event => {
        event.preventDefault();
        const mouseX = event.clientX + 2;
        const mouseY = event.clientY - 6;
        setContextMenu(
            contextMenu === null ? {mouseX, mouseY} : null,
        );
    };

    const handleClick =  event => {
        event.preventDefault();
        const root = document.getElementById('root');
        const name = '_join-current-meeting';
        const { options, date, from } = props;
        const customEvent = new CustomEvent(name, {
            detail: {name, ...props}
        });
        dispatch(addTeleconference({
            key: 'data',
            data: {
                mode: 'join',
                meetingId: id,
                privileged: true,
                date,
                videoMirrorMode: 'grid',
                from,
                response: 'join',
                type: 'room',
                audio: true,
            }
        }));
        root.dispatchEvent(customEvent);
    };

    return (
        <React.Fragment>
            <ListItem
                disablePadding
            >
                <ListItemButton 
                    sx={{overflow: 'hidden'}}
                    onContextMenu={handleContextMenu}
                    onClick={handleClick}
                >
                <ListItemAvatar>
                    <CustomBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        online
                        active
                    >
                        <AvatarStatus
                            type="room"
                            src={avatarSrc}
                            srcSet={avatarSrc}
                            alt={name}
                            id={id}
                        />
                    </CustomBadge>
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
                          <Typography color={color}>{calls} {iconCallType}</Typography>
                          <Typography variant="caption" color="text.secondary" >
                            Depuis {capStr(date)}
                          </Typography>  
                        </Stack>
                    }
                    primaryTypographyProps={{
                        component: 'div', 
                        noWrap: true,
                        title: name,
                        color: 'text.primary'
                    }}
                    secondaryTypographyProps={{
                        component: "div",
                        noWrap: true,
                        title: 'Un appel est en cours vous pouvez rejoindre', 
                        color,
                    }}
                />
                </ListItemButton>
            </ListItem>
        </React.Fragment>
    )
}

const useCallParams = () => {
    const theme = useTheme();
    return ({
        color: theme.palette.success.main,
        iconCallType: <OnlinePredictionIcon fontSize="inherit"/>
    });
}
