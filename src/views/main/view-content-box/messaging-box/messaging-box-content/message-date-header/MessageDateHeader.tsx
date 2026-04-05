import React from "react";
import { Divider, ListSubheader, Typography } from "@mui/material";
import { formatTime } from "../../../../../../utils/formatDate";

const MessageDateHeader = React.memo(({ date }) => {
  return (
    <ListSubheader
      sx={{
        zIndex: 0,
        alignItems: "center",
        display: "flex",
        bgcolor: "transparent",
        mt: 4,
        mb: 1,
      }}>
      <Divider orientation='horizontal' sx={{ width: "100%" }}>
        <Typography variant='caption' color='inherit'>
          {formatTime({ date, sameDayOption: "day" })}
        </Typography>
      </Divider>
    </ListSubheader>
  );
});

MessageDateHeader.displayName = "MessageDateHeader";

export default MessageDateHeader;
