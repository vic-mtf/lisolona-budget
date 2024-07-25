import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  createTheme,
  ThemeProvider,
  Toolbar,
  Tooltip,
} from "@mui/material";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import Typography from "../../../components/Typography";
import IconButton from "../../../components/IconButton";
import appConfig from "../../../configs/app-config.json";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import MoreOption from "./shortcut/MoreOption";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import ActionWrapper from "./actions/ActionWrapper";
import CustomBadge from "../../../components/CustomBadge";
import store from "../../../redux/store";
import { isBoolean } from "lodash";
import observeLastModification from "../../../utils/observeLastModification";
import db from "../../../database/db";
import countScheduleMeeting from "./countScheduleMeeting";

export default function Header({
  onChangeNavigation,
  navigation,
  onChangeSearch,
}) {
  const [anchor, setAnchor] = useState(null);
  const anchorEl = useRef();
  const notificationsNumber = useSelector(
    (store) => store?.data?.notifications?.length,
  );
  const [scheduleMeeting, setScheduleMeeting] = useState(0);

  const onCallChange = useCallback(async () => {
    const calls = await db.calls.toArray();
    const scheduleCall = countScheduleMeeting(calls);
    if (scheduleCall !== scheduleMeeting) setScheduleMeeting(scheduleCall);
  }, [scheduleMeeting]);

  const navigationOptions = useMemo(
    () => [
      {
        label: "Conversations",
        icon: <ChatOutlinedIcon />,
        nbr: 0,
      },
      {
        label: "Appels",
        icon: <CallOutlinedIcon />,
        nbr: scheduleMeeting,
        activeKey: "activeCall",
      },
      {
        label: "Contacts",
        icon: <ContactsOutlinedIcon />,
        nbr: 0,
      },
      {
        label: "Notifications",
        icon: <NotificationsNoneOutlinedIcon />,
        nbr: notificationsNumber || 0,
      },
    ],
    [notificationsNumber, scheduleMeeting],
  );

  useEffect(() => {
    const unsubscribe = observeLastModification("calls", onCallChange);
    onCallChange();
    return () => {
      unsubscribe();
    };
  }, [onCallChange]);

  return (
    <React.Fragment>
      <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
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
      <Toolbar variant="dense">
        <BottomNavigation
          showLabels
          value={navigation}
          sx={{ width: "100%", my: 1 }}
          onChange={onChangeNavigation}
        >
          {navigationOptions.map((nav, index) => (
            <BottomNavigationAction
              label={
                <LabelSignalActive activeKey={nav.activeKey}>
                  <Label active={navigation === index}>{nav.label}</Label>
                </LabelSignalActive>
              }
              icon={
                <StyledBadge color="primary" badgeContent={nav.nbr}>
                  {nav.icon}
                </StyledBadge>
              }
              key={index}
            />
          ))}
        </BottomNavigation>
      </Toolbar>
      <MoreOption onClose={() => setAnchor(null)} anchorEl={anchor} />
      <ActionWrapper />
    </React.Fragment>
  );
}

const Label = ({ children, active }) => {
  return (
    <Typography
      color={active ? "bacground.primary" : "text.primary"}
      fontSize={10}
      variant="caption"
      children={children}
    />
  );
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const LabelSignalActive = ({ children, activeKey }) => {
  const [active, setActive] = useState();

  useEffect(() => {
    if (activeKey) {
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().data[activeKey];
        if (isBoolean(state) && state !== active) setActive(state);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [activeKey, active]);

  return (
    <CustomBadge
      variant={active ? "dot" : undefined}
      online={active}
      active={active}
    >
      {children}
    </CustomBadge>
  );
};
