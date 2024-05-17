import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { fr } from 'date-fns/locale/fr';
import scrollBarSx from '../../../../utils/scrollBarSx';
import PropTypes from 'prop-types';

const DateCalendarMeeting = React.forwardRef (({ 
  readOnly, 
  disabled, 
  onChange, 
  value, 
  defaultValue = new Date() 
}, ref) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <DateCalendar 
          value={value} 
          ref={ref}
          onChange={onChange} 
          defaultValue={defaultValue}
          disablePast
          readOnly={readOnly}
          disabled={disabled}
          sx={{
              "& *": { ...scrollBarSx }
          }}
        />
    </LocalizationProvider>
  );
});

DateCalendarMeeting.propTypes = {
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
};

export default DateCalendarMeeting;
