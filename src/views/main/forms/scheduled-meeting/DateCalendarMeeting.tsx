import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale/fr';
import scrollBarSx from '../../../../utils/scrollBarSx';
import { FormLabel } from '@mui/material';

const DateCalendarMeeting = React.forwardRef(
  ({ error, ...otherProps }, ref) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <FormLabel htmlFor="meeting-calendar">Choisissez la date</FormLabel>
        <DateCalendar
          {...otherProps}
          ref={ref}
          disablePast
          id="meeting-calendar"
          sx={{
            '& *': { ...scrollBarSx },
            width: '100%',
            border: (theme) =>
              error
                ? '2px solid ' + theme.palette.error.main
                : '1px solid ' + theme.palette.action.selected,
            borderRadius: 1,
            '& .MuiYearCalendar-root': {
              width: '100%',
            },
          }}
        />
      </LocalizationProvider>
    );
  }
);

DateCalendarMeeting.displayName = 'DateCalendarMeeting';

export default DateCalendarMeeting;
