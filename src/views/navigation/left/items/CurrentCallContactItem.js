import { 
    ListItemButton, 
    ListItemAvatar, 
    ListItemText,
    ListItem,
    Stack,
    useTheme
} from "@mui/material";
import React from "react";
import capStr from '../../../../utils/capStr';
import Typography from "../../../../components/Typography";
import CustomBadge from "../../../../components/CustomBadge";
import AvatarStatus from "../../../../components/AvatarStatus";
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import { useDispatch, useSelector } from "react-redux";
import useHandleJoinMeeting from "../../../main/action/useHandleJoinMeeting";

export default function CurrentCallContactItem ({call}) {
    const {avatarSrc, name, date, type, format, origin, id, avatarsSrc, location} = call;
    console.log(call);
    const [contextMenu, setContextMenu] = React.useState(null);
    const {iconCallType, color } = useCallParams(type, format);
    const mode = useSelector(store => store.meeting.mode);
    const handleJoinMeeting = useHandleJoinMeeting();

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
                    <CustomBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        online
                        active
                    >
                        <AvatarStatus
                            type={type}
                            avatarSrc={avatarSrc}
                            avatarsSrc={avatarsSrc}
                            alt={name}
                            name={name}
                            id={id}
                            invisible
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
                          {/* <Typography variant="caption" color="text.secondary" >
                            Depuis {capStr(date)}
                          </Typography>   */}
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
