import React from "react";
import Box from "@mui/material/Box";

import BottomNavigation from "@mui/material/BottomNavigation";
import Badge from "@mui/material/Badge";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useSelector, useDispatch } from "react-redux";
import { updateConferenceData } from "../../../../../redux/conference/conference";
import { useMemo } from "react";
import navActions from "./navActions";

const NavActions = () => {
  const nav = useSelector((store) => store.conference.meeting.nav);
  const dispatch = useDispatch();

  const news = useMemo(
    () => ({
      chats: 0,
      participants: 0,
      infos: 0,
      authParams: 0,
    }),
    []
  );

  return (
    <Box display='flex' justifyContent='space-between'>
      <BottomNavigation
        showLabels
        value={(nav.open && nav.id) || ""}
        sx={{
          background: "none",
          width: "100%",
          p: 0,
          m: 0,
          "& .MuiBottomNavigationAction-root": {
            p: 0,
            m: 0,
            // fontSize: 10,
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "10px!important",
          },
        }}>
        {navActions.map((action) => (
          <BottomNavigationAction
            key={action.id}
            label={action.label}
            icon={
              <Badge
                badgeContent={news[action.id]}
                color='primary'
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiBadge-badge": {
                    // right: -3,
                    // top: 13,
                    fontSize: 10,
                    border: (t) =>
                      `2px solid ${(t.vars ?? t).palette.background.paper}`,
                    padding: "0 4px",
                  },
                }}>
                <action.icon />
              </Badge>
            }
            value={action.id}
            sx={{ borderRadius: 1 }}
            onClick={() => {
              dispatch(
                updateConferenceData({
                  key: ["meeting.nav.id", "meeting.nav.open"],
                  data: [action.id, nav.id === action.id ? !nav.open : true],
                })
              );
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default React.memo(NavActions);
