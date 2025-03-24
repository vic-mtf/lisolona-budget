import { createElement } from "react";
import { Badge, BottomNavigation, BottomNavigationAction } from "@mui/material";
import tabs from "./tabs";
import useNavTab from "../../../hooks/useNavTab";
import useSmallScreen from "../../../hooks/useSmallScreen";

export default function NavTab() {
  const [{ navTabValue }, { onChangeTabNav }] = useNavTab();
  const matches = useSmallScreen();
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
      {tabs.map(({ label, id, icon, disabled }) => (
        <BottomNavigationAction
          label={label}
          disabled={disabled}
          key={id}
          sx={{
            ...(disabled && {
              color: (theme) => theme.palette.action.disabled,
            }),
          }}
          icon={
            <Badge
              badgeContent={0}
              color='primary'
              sx={{
                "& .MuiBadge-badge": {
                  border: (theme) =>
                    `2px solid ${theme.palette.background.paper}`,
                },
              }}>
              {createElement(icon, matches && { sx: { fontSize: 26 } })}
            </Badge>
          }
          value={id}
        />
      ))}
    </BottomNavigation>
  );
}
