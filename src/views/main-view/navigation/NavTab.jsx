import { createElement } from "react";
import { Badge, BottomNavigation, BottomNavigationAction } from "@mui/material";
import tabs from "./tabs";
import useNavTab from "../../../hooks/useNavTab";

export default function NavTab() {
  const [{ navTabValue }, { onChangeTabNav }] = useNavTab();

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
      {tabs.map(({ label, id, icon }) => (
        <BottomNavigationAction
          label={label}
          key={id}
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
              {createElement(icon)}
            </Badge>
          }
          value={id}
        />
      ))}
    </BottomNavigation>
  );
}
