import { 
    ListItemButton, 
    ListItemAvatar, 
    ListItemText,
    ListItem,
    Stack,
    useTheme
} from "@mui/material";
import React from "react";
import Typography from "../../../../components/Typography";
import CustomBadge from "../../../../components/CustomBadge";
import AvatarStatus from "../../../../components/AvatarStatus";
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import {  useSelector } from "react-redux";
import useHandleJoinMeeting from "../../../main/action/useHandleJoinMeeting";
import TimeElapsed from "../../../../components/TimeElapsed";
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';

export default function CurrentCallContactItem ({call}) {
    const { avatarSrc, name, date, type, format, origin, id, avatarsSrc, location, createdAt, title, description } = call;
    const [contextMenu, setContextMenu] = React.useState(null);
    const {iconCallType, color } = useCallParams(type, format);
    const mode = useSelector(store => store.meeting.mode);
    const handleJoinMeeting = useHandleJoinMeeting();

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
        const data = {id: location, name, avatarSrc, type};
        handleJoinMeeting({data, origin});
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
                    disabled={mode !== 'none'}
                >
                <ListItemAvatar>
                    <AvatarStatus
                        type={type}
                        avatarSrc={avatarSrc}
                        avatarsSrc={avatarsSrc}
                        alt={name}
                        name={name}
                        id={location} 
                        // online
                        active
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            { title }
                          </Typography>
                          {` — ${description}`}
                        </React.Fragment>
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
                        title: '', 
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
