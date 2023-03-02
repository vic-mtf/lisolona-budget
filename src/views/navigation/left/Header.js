import { 
    Badge,
    BottomNavigation, 
    BottomNavigationAction, 
    createTheme, 
    ThemeProvider, 
    Toolbar, 
    Tooltip
} from "@mui/material";
import React, { useRef, useState } from "react";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import Typography from "../../../components/Typography";
import IconButton from "../../../components/IconButton";
import appConfig from '../../../configs/app-config.json';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import MoreOption from "./shortcut/MoreOption";
import SearchBar from "./SearchBar";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";

export default function Header ({onChangeNavigation, navigation}) {
    const [anchor, setAnchor] = useState(null);
    const anchorEl = useRef();
    const notificationsNumber = useSelector(
        store => store?.data?.notifications?.length || 0
    );
    const navigationOptions = [
        {
            label: 'Conversations',
            icon: <ChatOutlinedIcon/>,
            nbr: 0,
        },
        {
            label: 'Appels',
            icon: <CallOutlinedIcon/>,
            nbr: 0
        },
        {
            label: 'Contactes',
            icon: <ContactsOutlinedIcon/>,
            nbr: 0
        },
        {
            label: 'Notifications',
            icon: <NotificationsNoneOutlinedIcon/>,
            nbr: notificationsNumber,
        }
    ];
    return (
        <React.Fragment>
            <ThemeProvider theme={createTheme({palette:{mode: 'dark'}})}>
                <Toolbar variant="dense" sx={{bgcolor: appConfig.colors.main}}>
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
                        <IconButton
                            aria-label="more"
                            ref={anchorEl}
                            onClick={() => setAnchor(anchorEl?.current)}
                        >
                            <MoreVertOutlinedIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </ThemeProvider>
            <Toolbar variant="dense" disableGutters sx={{px: 1}}>
                <SearchBar/>
                <IconButton>
                    <FilterListOutlinedIcon fontSize="small"/>
                </IconButton>
            </Toolbar>
            <Toolbar variant="dense" disableGutters sx={{px: 2}}>
                <BottomNavigation
                    showLabels
                    value={navigation}
                    sx={{ width: '100%'}}
                    onChange={onChangeNavigation}
                >
                    {
                        navigationOptions.map((nav, index) => (
                            <BottomNavigationAction 
                                label={
                                    <Label active={navigation === index }>
                                        {nav.label}
                                    </Label>
                                }   
                                icon={
                                    <StyledBadge 
                                        color="primary" 
                                        badgeContent={nav.nbr}
                                    >
                                    {nav.icon}
                                    </StyledBadge>
                                } 
                                key={index}
                            />
                        ))
                    }
                </BottomNavigation>
            </Toolbar>
            <MoreOption
                onClose={() => setAnchor(null)}
                anchorEl={anchor}
            />
        </React.Fragment>
    )
}

const Label = ({children, active}) => {
    return (
        <Typography 
            color={active ? "bacground.primary" : "text.primary"} 
            fontSize={10} 
            variant="caption" 
            children={children} 
        />
    )
}

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));
