import { 
    ListItemButton, 
    ListItemText,
    Menu,
    ListItem,
} from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import Typography from "../../../../components/Typography";
import timeHumanReadable from "../../../../utils/timeHumanReadable";
import highlightWord from "../../../../utils/highlightWord";
import AvatarStatus from "../../../../components/AvatarStatus";
import Notice from "./Notice";

function DiscussionItem ({
    avatarSrc, 
    name, 
    lastNotice, 
    updatedAt,
    lastDate, 
    online,
    type,
    onClick,
    selected,
    search,
    ...otherProps
}) {
    const [contextMenu, setContextMenu] = React.useState(null);
   
    return (
        <React.Fragment>
            <ListItem
                disablePadding
                onClick={onClick}
            >
                <ListItemButton 
                    sx={{overflow: 'hidden'}}
                    selected={selected}
                    onContextMenu={event => {
                        event.preventDefault();
                        const mouseX = event.clientX + 2;
                        const mouseY = event.clientY - 6;
                        setContextMenu(
                            contextMenu === null ? {mouseX, mouseY} : 
                            null
                        );
                    }}
                >
                <AvatarStatus
                    id={otherProps.id}
                    avatarSrc={avatarSrc}
                    type={type}
                    name={name}
                />
                <ListItemText
                    primary={
                        <Stack direction="row" spacing={1}>
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
                        <Notice
                            type={type}
                            id={otherProps.id}
                            name={name}
                            description={otherProps.description}
                            message={lastNotice}
                        />
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

export default React.memo(DiscussionItem);