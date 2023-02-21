import { 
    ListItemButton, 
    ListItemAvatar, 
    ListItemText,
    Menu,
    ListItem,
    Badge
} from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import Avatar from "../../../../components/Avatar";
import CustomBadge from "../../../../components/CustomBadge";
import Typography from "../../../../components/Typography";
import timeHumanReadable from "../../../../utils/timeHumanReadable";

export default function ChatContactItem ({avatarSrc, name, lastNotice, lastDate}) {
    const [contextMenu, setContextMenu] = React.useState(null);
    
    return (
        <React.Fragment>
            <ListItem
                disablePadding
            >
                <ListItemButton 
                    sx={{overflow: 'hidden'}}
                    onContextMenu={event => {
                        event.preventDefault();
                        const mouseX = event.clientX + 2;
                        const mouseY = event.clientY - 6;
                        setContextMenu(
                        contextMenu === null ? {mouseX, mouseY} : null,
                        );
                    }}
                >
                <ListItemAvatar>
                    <CustomBadge 
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        online={Math.random() > .5}
                    >
                        <Avatar
                            src={avatarSrc}
                            srcSet={avatarSrc}
                            alt={name}
                        />
                    </CustomBadge>
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
                                children={timeHumanReadable(
                                  Date.now() - (parseInt(Math.random() * 24 * 30) * 60 *60 * 1000)
                                )} 
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
                                badgeContent={parseInt(Math.random() * 1000)} 
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