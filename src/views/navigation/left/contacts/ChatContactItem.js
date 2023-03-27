import { 
    ListItemButton, 
    ListItemText,
    Menu,
    ListItem,
    Badge,
} from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import Typography from "../../../../components/Typography";
import timeHumanReadable from "../../../../utils/timeHumanReadable";
import { convert } from "html-to-text";
import highlightWord from "../../../../utils/highlightWord";
import ContactAvatar from "./ContactAvatar";

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
    const { selected, search } = useSelector(
        store => {
            const selected = store.data?.chatId === otherPorps?.id;
            const search = store.data?.search;
            return {selected, search}
        }
    );
    const lastNotice = convert(_lastNotice, { wordwrap: 130 });
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
                        setContextMenu(contextMenu === null ? {mouseX, mouseY} : null);
                    }}
                    onClick={onClick}
                >
                <ContactAvatar
                    id={otherPorps.id}
                    avatarSrc={avatarSrc}
                    type={type}
                    name={name}
                />
                <ListItemText
                    primary={
                        <Stack direction="row" spacing={1} >
                            <Typography 
                                title={name} 
                                children={highlightWord(name, search)} 
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
            ></Menu>
        </React.Fragment>
    )
}