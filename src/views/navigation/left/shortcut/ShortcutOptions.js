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
import { useLiveQuery } from "dexie-react-hooks";
import ContactListForm from "../lists/contact-list-form/ContactListForm";
import { useData } from "../../../../utils/DataProvider";
import db from "../../../../database/db";

export default function ShortcutOptions () {

    const groups = useLiveQuery(() => 
        db?.discussions.orderBy('createdAt')
        .filter(({type}) => type === 'room')
        .toArray(),
    []);
    
    const target = useSelector(store => store?.data?.target);
    const dispatch = useDispatch();

    return (
        <React.Fragment>
          <ContactListForm/>
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
                    {groups?.map((group, index) => (
                    <Tab 
                        key={index}
                        MenuItemProps={{
                            selected: target?.id === group?.id,
                            onClick() {
                                dispatch(
                                    addData({
                                        key: 'target', 
                                        data: JSON.parse(JSON.stringify(group))
                                    })
                                )
                            }
                        }}
                    >
                        <ShortcutAvatar
                            name={group?.name}
                            alt={group?.name}  
                            src={group?.avatarSrc}
                            id={group?.id}
                            len={1}
                            title={`Lisanga: ${group?.name}\nDescription: ${group?.description}`}
                        />
                    </Tab>
                    )).slice(0, 100)}
                </Tabs>
                {groups === undefined ?
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
                        onClick={() => window.close()}
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