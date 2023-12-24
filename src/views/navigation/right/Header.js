import {
    Badge,
    BottomNavigation,
    BottomNavigationAction,
    createTheme,
    ThemeProvider,
    Toolbar,
    Tooltip
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import Typography from "../../../components/Typography";
import IconButton from "../../../components/IconButton";
import appConfig from '../../../configs/app-config.json';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import MoreOption from "./shortcut/MoreOption";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import ActionWrapper from "./actions/ActionWrapper";
import CustomBadge from "../../../components/CustomBadge";
import store from "../../../redux/store";
import { isBoolean } from "lodash";
import { setData } from "../../../redux/data";

export default function Header({ onChangeNavigation, navigation, onChangeSearch }) {
    const [anchor, setAnchor] = useState(null);
    const anchorEl = useRef();
    const notificationsNumber = useSelector(store => store?.data?.notifications?.length);
    const navigationOptions = useMemo(() => [
        {
            label: 'Conversations',
            icon: <ChatOutlinedIcon />,
            nbr: 0,
        },
        {
            label: 'Appels',
            icon: <CallOutlinedIcon />,
            nbr: 0,
            activeKey: 'activeCall'
        },
        {
            label: 'Contacts',
            icon: <ContactsOutlinedIcon />,
            nbr: 0
        },
        {
            label: 'Notifications',
            icon: <NotificationsNoneOutlinedIcon />,
            nbr: notificationsNumber || 0,
        }
    ], [notificationsNumber]);

    return (
        <React.Fragment>
            <ThemeProvider theme={createTheme({ palette: { mode: 'dark' } })}>
                <Toolbar variant="dense" sx={{ bgcolor: appConfig.colors.main }}>
                    <Typography
                        flexGrow={1}
                        fontSize={18}
                        fontWeight="bold"
                        variant="h6"
                        noWrap
                        component="div"
                        color="text.primary"
                    >
                        Lisolo Na Budget
                    </Typography>
                    <Tooltip title="Plus d'options" arrow>
                        <div>
                            <IconButton
                                aria-label="more"
                                disabled
                                ref={anchorEl}
                                onClick={() => setAnchor(anchorEl?.current)}
                            >
                                <MoreVertOutlinedIcon fontSize="small" />
                            </IconButton>
                        </div>
                    </Tooltip>
                </Toolbar>
            </ThemeProvider>
        </React.Fragment>
    )
}

