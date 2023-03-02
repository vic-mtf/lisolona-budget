import { 
    ListItemButton, 
    ListItemAvatar, 
    ListItemText,
    Menu,
    ListItem,
    Badge,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Avatar from "../../../../components/Avatar";
import CustomAvatarGroup from "../../../../components/CustomAvatarGroup";
import CustomBadge from "../../../../components/CustomBadge";
import Typography from "../../../../components/Typography";
import timeHumanReadable from "../../../../utils/timeHumanReadable";
import parse from 'html-react-parser';
import { convert } from "html-to-text";

export default function ChatContactItem ({
    avatarSrc, 
    name, 
    lastNotice: _lastNotice, 
    updatedAt,
    lastDate, 
    online,
    type,
    onClick,
    ...otherPorps
}) {
    const [contextMenu, setContextMenu] = React.useState(null);
    const selected = useSelector(
        store => store.data?.chatId === otherPorps?.id
    );
    const lastNotice = convert(
        _lastNotice, 
        { wordwrap: 130 }
    );
    return (
        <React.Fragment>
            <ListItem
                disablePadding
            >
                <ListItemButton 
                    sx={{overflow: 'hidden'}}
                    selected={selected}
                    onContextMenu={event => {
                        event.preventDefault();
                        const mouseX = event.clientX + 2;
                        const mouseY = event.clientY - 6;
                        setContextMenu(
                        contextMenu === null ? {mouseX, mouseY} : null,
                        );
                    }}
                    onClick={onClick}
                >
                <ListItemAvatar>
                    {type === 'direct'&&
                    <CustomBadge 
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        online={online}
                    >
                        <Avatar
                            src={avatarSrc}
                            srcSet={avatarSrc}
                            alt={name}
                            children={name?.charAt(0)}
                        />
                    </CustomBadge>}
                    {type === 'room'&&
                    <CustomAvatarGroup>
                        <Avatar
                            src={avatarSrc}
                            srcSet={avatarSrc}
                            //alt={name}
                            //children={name?.charAt(0)}
                        />
                        <Avatar
                            src={avatarSrc}
                            srcSet={avatarSrc}
                            alt={name}
                            //children={name?.charAt(0)}
                        />
                    </CustomAvatarGroup>}
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Stack direction="row" spacing={1} >
                            <Typography 
                                title={name} 
                                children={name} 
                                flexGrow={1} 
                                noWrap 
                                textOverflow="ellipsis"
                            />
                            <Typography 
                                noWrap 
                                children={timeHumanReadable(updatedAt)} 
                                variant="caption" 
                                color="text.secondary"
                            />
                        </Stack>
                    }
                    secondary={
                        <Stack direction="row" spacing={1} >
                            <Typography 
                                variant="caption"
                                noWrap
                                textOverflow="ellipsis"
                                title={lastNotice}
                                flexGrow={1} 
                                children={lastNotice}
                                color="text.secondary"
                            />
                            <Badge 
                                badgeContent={0} 
                                color="primary"
                                sx={{
                                    width: 20,
                                    [`& .MuiBadge-badge`]: {
                                        right: 10,
                                        top: 10,
                                        padding: '0 4px',
                                    }
                                }}
                            />
                        </Stack>
                    }
                    primaryTypographyProps={{component: 'div'}}
                    secondaryTypographyProps={{
                        component: "div",
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
                // transformOrigin={{
                //     vertical: 'top',
                //     horizontal: 'letf',
                // }}
            ></Menu>
        </React.Fragment>
    )
}