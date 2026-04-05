import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers';
import scrollBarSx from '../../../../utils/scrollBarSx';

const TimeDurationMeeting = React.forwardRef(
  ({ error, onBlur, onChange, ...otherProps }, ref) => {
    const handleChange = (newValue) => {
      if (!newValue || !newValue.isValid()) {
        onChange(null);
        return;
      }

      const hour = newValue.hour();
      const minute = newValue.minute();

      const validHour = hour >= 0 && hour <= 23;
      const validMinute = minute >= 0 && minute <= 59;

      let correctedValue;

      if (validHour && validMinute) {
        correctedValue = newValue;
      } else if (validMinute && !validHour) {
        correctedValue = newValue.hour(0);
      } else if (validHour && !validMinute) {
        correctedValue = newValue.minute(0);
      } else {
        correctedValue = null;
      }

      onChange(correctedValue);
    };
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Durée"
          slotProps={{
            textField: {
              fullWidth: true,
              onBlur,
              color: error ? 'error' : 'primary',
            },

            popper: {
              sx: {
                '& .MuiList-root': {
                  ...scrollBarSx,
                  '& li:first-of-type': {
                    display: 'none',
                  },
                },
                '& .MuiList-root:last-child': {
                  display: 'none',
                },
              },
            },
          }}
          format="HH:mm"
          {...otherProps}
          onChange={handleChange}
          onError={(e, v) => {
            console.error(v);
            handleChange(v);
          }}
          ref={ref}
          minTime={dayjs().hour(0).minute(4).second(0)}
          //disableIgnoringDatePartForTimeValidation
          views={['hours', 'minutes']}
          skipDisabled
        />
      </LocalizationProvider>
    );
  }
);

TimeDurationMeeting.displayName = 'TimeDurationMeeting';

export default TimeDurationMeeting;
