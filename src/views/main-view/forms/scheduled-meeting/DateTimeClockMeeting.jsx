import React, { useMemo, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import PropTypes from "prop-types";
import { Box, FormLabel, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import dayjs from "dayjs";

const DateTimeClockMeeting = React.forwardRef(
  ({ error, calendarDate, ...otherProps }, ref) => {
    const [view, setView] = useState("hours");
    const { hours, minutes } = useMemo(() => {
      const date = dayjs(otherProps.value);
      return { hours: date.hour(), minutes: date.minute() };
    }, [otherProps.value]);
    const onChange = useMemo(() => otherProps.onChange, [otherProps.onChange]);
    useEffect(() => {
      if (calendarDate && typeof onChange === "function") onChange(null);
    }, [onChange, calendarDate]);
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormLabel htmlFor='meeting-time-clock'>
          {"Selectionnez l'heure"}
        </FormLabel>
        <Box position='relative'>
          <Box
            position='absolute'
            top={0}
            display='flex'
            flexDirection='row'
            justifyContent='center'
            alignItems='center'
            zIndex={1}
            p={2}>
            <IconButton
              onClick={() => setView("hours")}
              color={error ? "error" : "inherit"}>
              {hours || "--"}
            </IconButton>
            <Typography
              variant='h5'
              py={0.5}
              fontWeight='bold'
              color={error ? "error.main" : "text.primary"}>
              :
            </Typography>
            <IconButton
              onClick={() => setView("minutes")}
              color={error ? "error" : "inherit"}>
              {minutes || "--"}
            </IconButton>
          </Box>
          <TimeClock
            {...otherProps}
            view={view}
            onViewChange={(view) => setView(view)}
            id='meeting-time-clock'
            ref={ref}
            showViewSwitcher
            disabled={!calendarDate}
            ampm={false}
            sx={{
              border: (theme) =>
                "1px solid " + error ? theme.palette.error.main : "transparent",
              borderRadius: 1,
              width: "100%",
              color: "error.main",
            }}
          />
        </Box>
      </LocalizationProvider>
    );
  }
);

DateTimeClockMeeting.displayName = "DateTimeClockMeeting";

DateTimeClockMeeting.propTypes = {
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  calendarDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.object,
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
};

export default DateTimeClockMeeting;
