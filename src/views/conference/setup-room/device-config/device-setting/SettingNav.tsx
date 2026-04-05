import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import settingNavItems from "./settingNavItems";

const SettingNav = ({ tab, setTab }) => {
  return (
    <Box>
      <List disablePadding sx={{ pr: { xs: 0, md: 1 } }}>
        {settingNavItems.map(({ value, label, icon: Icon }) => (
          <ListItem key={value} disablePadding>
            <ListItemButton
              selected={tab === value}
              onClick={() => setTab(value)}
              sx={{
                borderRadius: {
                  md: "0px 50px 50px 0px",
                  xs: 0,
                },
              }}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{ primary: { variant: "body2" } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default React.memo(SettingNav);
