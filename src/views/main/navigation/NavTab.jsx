import { createElement } from "react";
import { Badge, BottomNavigation, BottomNavigationAction } from "@mui/material";
import tabs from "./tabs";
import useNavTab from "../../../hooks/useNavTab";
import useSmallScreen from "../../../hooks/useSmallScreen";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { useEffect } from "react";

export const NAVIGATE_EVENT_NAME = "_NAVIGATION_TAB";

export default function NavTab() {
  const [{ navTabValue }, { onChangeTabNav }] = useNavTab();
  const notifications = useSelector(
    (store) => store.data?.app.notifications.length
  );

  const matches = useSmallScreen();
  const badgeContent = useMemo(() => ({ notifications }), [notifications]);

  useEffect(() => {
    const onNavigateToTab = ({ detail: { name, tab } }) => {
      if (name === NAVIGATE_EVENT_NAME) onChangeTabNav(null, tab);
    };
    document
      .getElementById("root")
      .addEventListener(NAVIGATE_EVENT_NAME, onNavigateToTab);
    return () => {
      document
        .getElementById("root")
        .removeEventListener(NAVIGATE_EVENT_NAME, onNavigateToTab);
    };
  }, [onChangeTabNav]);

  return (
    <BottomNavigation
      value={navTabValue}
      onChange={onChangeTabNav}
      showLabels
      sx={{
        "& .MuiBottomNavigationAction-label, & .Mui-selected .MuiBottomNavigationAction-label":
          {
            fontSize: 10,
          },
      }}>
      {tabs.map(({ label, id, icon = "div", disabled }) => (
        <BottomNavigationAction
          label={label}
          disabled={disabled}
          key={id}
          sx={{
            ...(disabled && {
              color: (t) => t.palette.action.disabled,
            }),
          }}
          icon={
            <Badge
              badgeContent={badgeContent[id]}
              color='primary'
              sx={{
                "& .MuiBadge-badge": {
                  border: (t) => `2px solid ${t.palette.background.paper}`,
                },
              }}>
              {createElement(icon, matches ? { sx: { fontSize: 26 } } : {})}
            </Badge>
          }
          value={id}
        />
      ))}
    </BottomNavigation>
  );
}
