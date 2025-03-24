import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { TimePicker } from "@mui/x-date-pickers";
import scrollBarSx from "../../../../utils/scrollBarSx";

const TimeDurationMeeting = React.forwardRef(
  ({ error, onBlur, ...otherProps }, ref) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label='Durrée'
          slotProps={{
            textField: {
              fullWidth: true,
              onBlur,
              color: error ? "error" : "primary",
            },
            popper: {
              sx: {
                "& .MuiList-root": {
                  ...scrollBarSx,
                  "& li:first-of-type": {
                    display: "none",
                  },
                },
                "& .MuiList-root:last-child": {
                  display: "none",
                },
              },
            },
          }}
          format='HH:mm'
          {...otherProps}
          ref={ref}
          minTime={dayjs().hour(0).minute(4).second(0)}
          disableIgnoringDatePartForTimeValidation
          views={["hours", "minutes"]}
          skipDisabled
        />
      </LocalizationProvider>
    );
  }
);

TimeDurationMeeting.propTypes = {
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(Date),
    PropTypes.string,
    PropTypes.number,
  ]),
};

TimeDurationMeeting.displayName = "TimeDurationMeeting";

export default TimeDurationMeeting;
