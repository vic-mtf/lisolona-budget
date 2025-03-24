import React from "react";
import {
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import ListAvatar from "../../../../components/ListAvatar";
import getFullName from "../../../../utils/getFullName";
import PropTypes from "prop-types";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ScheduledActionButtonItem from "./ScheduledActionButtonItem";
import formatDate, { calculateDuration } from "../../../../utils/formatDate";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

const ScheduledCallItem = React.memo(
  ({
    location,
    divider,
    createdAt,
    title = null,
    description = null,
    startedAt,
    endedAt,
    code,
    ...otherProps
  }) => {
    const name = getFullName(location);

    const desc = (separator = " — ") =>
      `${title}${description ? separator + description : ""}`.trim();

    return (
      <div>
        <ListItem
          secondaryAction={
            <ScheduledActionButtonItem
              code={code}
              title={title}
              description={description}
              name={name}
            />
          }
          alignItems='flex-start'
          disablePadding
          {...otherProps}>
          <ListItemButton>
            <ListItemAvatar>
              <ListAvatar
                src={location?.image}
                alt={name}
                id={location?.id}
                status='away'
                invisible={false}
                SignalBadgeProps={{
                  badgeContent: (
                    <ScheduleOutlinedIcon
                      sx={{ color: "text.secondary", fontSize: 24 }}
                      fontSize='small'
                    />
                  ),
                  variant: "standard",
                  sx: {
                    "& .MuiBadge-badge": {
                      color: "background.paper",
                      p: 0,
                      border: "none",
                      width: 10,
                    },
                  },
                }}>
                {name?.toUpperCase()?.charAt(0)}
              </ListAvatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Stack direction='row' spacing={1}>
                  <Typography
                    flexGrow={1}
                    textOverflow='ellipsis'
                    whiteSpace='nowrap'
                    overflow='hidden'
                    fontWeight={550}>
                    {name}
                  </Typography>
                  <Typography
                    variant='caption'
                    component='span'
                    whiteSpace='nowrap'>
                    {formatDate({ date: startedAt })}
                  </Typography>
                </Stack>
              }
              secondary={
                <Stack direction='row' spacing={1}>
                  <Typography
                    alignItems='center'
                    flexGrow={1}
                    textOverflow='ellipsis'
                    whiteSpace='nowrap'
                    overflow='hidden'
                    variant='body2'
                    display='flex'
                    gap={1}
                    flexDirection='row'
                    color='text.secondary'>
                    <CalendarMonthOutlinedIcon fontSize='small' />
                    {calculateDuration(startedAt, endedAt)}
                    <span
                      style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                      {desc()}
                    </span>
                  </Typography>
                </Stack>
              }
              primaryTypographyProps={{ component: "div", title: name }}
              secondaryTypographyProps={{ component: "div", title: desc("\n") }}
            />
          </ListItemButton>
        </ListItem>
        <Divider variant='inset' sx={{ opacity: divider ? 1 : 0 }} />
      </div>
    );
  }
);

ScheduledCallItem.displayName = "ScheduledCallItem";

ScheduledCallItem.propTypes = {
  location: PropTypes.object,
  divider: PropTypes.bool,
  startedAt: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  endedAt: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  description: PropTypes.string,
  title: PropTypes.string,
  createdAt: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ScheduledCallItem;
