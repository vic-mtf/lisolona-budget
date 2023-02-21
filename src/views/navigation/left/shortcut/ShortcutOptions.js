import { Stack, Toolbar, Tooltip, Box as MuiBox, Tabs } from "@mui/material";
import React from "react";
import IconButton from "../../../../components/IconButton";
import Avatar from "../../../../components/Avatar";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import CustomBadge from "../../../../components/CustomBadge";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

export default function ShortcutOptions () {

    const chatGroups = [
        { name: "Masolo"}, { name: "Masolo"}, { name: "Masolo"}, {name: "Masolo"},
        { name: "Masolo"}, { name: "Masolo"}, { name: "Masolo"}, {name: "Masolo"},
        { name: "Masolo"}, { name: "Masolo"}, { name: "Masolo"}, {name: "Masolo"},
    ];

    return (
        <React.Fragment>
          <Toolbar variant="dense" disableGutters sx={{display: 'flex', justifyContent: 'center', mb:2}}>
            
                <CustomBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                >  
                    <Avatar alt="Remy Sharp" src="/"/>
                </CustomBadge>
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
                    {chatGroups.map(({name}, index) => (
                    <Tab key={index}>
                        <Avatar alt={name}  src="/" />
                    </Tab>
                    )).slice(0, 100)}
                </Tabs>
                <Tooltip title="Créer un nouveau groupe" arrow placement="right-start">
                    <IconButton>
                        <GroupAddOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>
          <Toolbar variant="dense" disableGutters sx={{display: 'flex', justifyContent: 'center'}}>
            <Stack spacing={1} my={2}>
                <Tooltip title="Paramètre" arrow placement="right-start">
                    <IconButton>
                        <SettingsOutlinedIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Sortir" arrow placement="right-start">
                    <IconButton>
                        <ExitToAppOutlinedIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </Stack>
          </Toolbar>
        </React.Fragment >
    )
}

const Tab = ({children}) => (
    <MuiBox my={.5}>
        {children}
    </MuiBox>
)