import { Stack, Toolbar, Tooltip, Box as MuiBox, Tabs, MenuItem } from "@mui/material";
import React from "react";
import IconButton from "../../../../components/IconButton";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AvatarProfile from "./AvatarProfile";
import { useDispatch, useSelector } from "react-redux";
import CustomSkeleton from "../../../../components/Skeleton";
import { addData } from "../../../../redux/data";
import ShortcutAvatar from "./ShortcutAvatar";

export default function ShortcutOptions () {
    const {chatGroups, chatId} = useSelector(store => {
        const {chatGroups, chatId} = store?.data;
        return {chatGroups, chatId};
    });
    const dispatch = useDispatch();
    return (
        <React.Fragment>
          <Toolbar variant="dense" disableGutters sx={{display: 'flex', justifyContent: 'center', mb:2}}>
            
                <AvatarProfile/>
          </Toolbar>
            <Stack
                display="flex"
                flex={1}
                alignItems="center"
                spacing={1}
                overflow="hidden"
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={0}
                    sx={{
                        [`& .MuiTabs-indicator`]: {
                            display: 'none'
                        }
                    }}
                    TabScrollButtonProps={{
                        sx: {height: 10},
                    }}
                >
                    {chatGroups?.map(({
                        name, 
                        avatarSrc, 
                        image,
                        description, 
                        _id
                    }, index) => (
                    <Tab 
                        key={index}
                        MenuItemProps={{
                            selected: chatId === _id,
                            onClick() {
                                dispatch(addData({key: 'chatId', data: _id}))
                            }
                        }}
                    >
                        <ShortcutAvatar
                            name={name}
                            alt={name}  
                            src={avatarSrc}
                            id={_id}
                            len={1}
                            title={`Lisanga: ${name}\nDescription: ${description}`}
                        />
                    </Tab>
                    )).slice(0, 100)}
                </Tabs>
                {chatGroups === null ?
                [0, 1, 2, 4, 5, 6, 7, 8].map(key => (
                    <CustomSkeleton
                        key={key}
                        variant="rounded"
                        sx={{
                            borderRadius: 2,
                            width: 42,
                            height: 42
                        }}
                    />
                )) :
                <Tooltip 
                    title="Créer nouveau Lisanga" 
                    arrow 
                    placement="right-start"
                >
                    <IconButton
                        onClick={() => {
                            const name = '_auto_open_create_group';
                            const customEvent = new CustomEvent(name, {
                                detail: {name, mode: 'group'}
                            });
                            document
                            .getElementById('root')
                            .dispatchEvent(customEvent);
                        }}
                    >
                        <GroupAddOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>}
            </Stack>
          <Toolbar variant="dense" disableGutters sx={{display: 'flex', justifyContent: 'center'}}>
            <Stack spacing={1} my={2}>
                <Tooltip title="Paramètre" arrow placement="right-start">
                    <div>
                        <IconButton
                            disabled
                        >
                            <SettingsOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </div>
                </Tooltip>
                <Tooltip title="Sortir" arrow placement="right-start">
                    <IconButton
                        LinkComponent="a"
                        href="/"
                    >
                        <ExitToAppOutlinedIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </Stack>
          </Toolbar>
        </React.Fragment >
    )
}

const Tab = ({children, MenuItemProps}) => (
    <MuiBox my={.5}>
        <MenuItem {...MenuItemProps}>
            {children}
        </MenuItem>
    </MuiBox>
)