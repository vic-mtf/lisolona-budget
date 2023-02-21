import { 
    ListItemButton, 
    ListItemAvatar, 
    ListItemText,
    Menu,
    ListItem,
    Zoom,
    Stack,
    Tooltip,
    Box as MuiBox
} from "@mui/material";
import React, { useState } from "react";
import Avatar from "../../../../components/Avatar";
import IconButton from "../../../../components/IconButton";
import CustomBadge from "../../../../components/CustomBadge";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Button from "../../../../components/Button";
import Typography from "../../../../components/Typography";
import capStr from "../../../../utils/capStr";

export default function InviteContactItem ({avatarSrc, name, email, date}) {
    const [contextMenu, setContextMenu] = useState(null);
    const [showSecondaryAction, setShowSecondaryAction] = useState(false);
    
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
                secondaryAction={
                    <Stack spacing={1}> 
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >{capStr(date)}</Typography>   
                        <Zoom in={showSecondaryAction}>
                            <Tooltip title="Plus d'option" arrow>
                                <MuiBox textAlign="right">     
                                    <IconButton onClick={handleContextMenu}>
                                        <ExpandMoreOutlinedIcon fontSize="small"/>
                                    </IconButton>
                                </MuiBox> 
                            </Tooltip> 
                        </Zoom>
                    </Stack>
                }
                onMouseEnter={() => setShowSecondaryAction(true)}
                onMouseLeave={() => setShowSecondaryAction(false)}
                onContextMenu={handleContextMenu}
            >
                <ListItemAvatar>
                    <Avatar
                        src={avatarSrc}
                        srcSet={avatarSrc}
                        alt={name}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={
                        <Stack spacing={1} direction="row" mt={1}>
                            <Button variant="contained" fullWidth>Accepter</Button>
                            <Button variant="outlined" fullWidth>Refuser</Button>
                        </Stack>
                    }
                    primaryTypographyProps={{
                        component: 'div', 
                        noWrap: true,
                        title: name,
                        maxWidth: '70%'
                    }}
                    secondaryTypographyProps={{
                        component: "div",
                        noWrap: true,
                        title: email,
                    }}
                    sx={{mr: 1}}
                />
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