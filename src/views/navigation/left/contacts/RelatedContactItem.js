import { 
    ListItemButton, 
    ListItemAvatar, 
    ListItemText,
    Menu,
    ListItem,
    Zoom,
    Stack,
    Tooltip,
} from "@mui/material";
import React from "react";
import Avatar from "../../../../components/Avatar";
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import IconButton from "../../../../components/IconButton";
import CustomBadge from "../../../../components/CustomBadge";

export default function RelatedContactItem ({avatarSrc, name, email}) {
    const [contextMenu, setContextMenu] = React.useState(null);
    const [showSecondaryAction, setShowSecondaryAction] = React.useState(false);
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
                secondaryAction={
                    <Stack direction="row" spacing={1}>   
                        <Zoom in={showSecondaryAction}>  
                            <Tooltip title="Lancer un appel vidéo" arrow>     
                                <IconButton>
                                    <VideocamOutlinedIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip>   
                        </Zoom> 
                        <Zoom in={showSecondaryAction}>
                            <Tooltip title="Lancer un appel" arrow>     
                                <IconButton>
                                    <LocalPhoneOutlinedIcon fontSize="small"/>
                                </IconButton>
                            </Tooltip> 
                        </Zoom>
                    </Stack>
                }
                onMouseEnter={() => setShowSecondaryAction(true)}
                onMouseLeave={() => setShowSecondaryAction(false)}
            >
                <ListItemButton 
                    sx={{overflow: 'hidden'}}
                    onContextMenu={handleContextMenu}
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
                    primary={name}
                    secondary={email}
                    primaryTypographyProps={{
                        component: 'div', 
                        noWrap: true,
                        title: name,
                    }}
                    secondaryTypographyProps={{
                        component: "div",
                        noWrap: true,
                        title: email,
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