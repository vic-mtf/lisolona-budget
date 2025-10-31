import React, { useMemo, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useWatch } from 'react-hook-form';
import { useEffect } from 'react';

const DateTimeClockMeeting = React.forwardRef(
  ({ error, ...otherProps }, ref) => {
    const [view, setView] = useState('hours');
    const date = useWatch({ name: 'date' });

    const minTime = useMemo(() => {
      const now = dayjs().format('YYYY/DD/MM');
      const calendarDate = dayjs(date || undefined).format('YYYY/DD/MM');
      if (now === calendarDate) return dayjs();
    }, [date]);

    const { hours, minutes } = useMemo(() => {
      const date = dayjs(otherProps.value);
      return { hours: date.hour(), minutes: date.minute() };
    }, [otherProps.value]);

    const pad = (value) => {
      if (typeof value === 'number' && !isNaN(value))
        return value.toString().padStart(2, '0');
      return '--';
    };

    useEffect(() => {
      if (!minTime) return;
      const now = dayjs();
      const nowTime = now.hour() * 60 + now.minute();
      const otherTime =
        otherProps.value?.hour() * 60 + otherProps.value?.minute();
      if (nowTime >= otherTime) otherProps.onChange(now.add(10, 'minute'));
    });

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormLabel htmlFor="meeting-time-clock">
          {"Sélectionnez l'heure"}
        </FormLabel>
        <Box position="relative">
          <Box
            position="absolute"
            top={0}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            zIndex={1}
            p={2}
          >
            <IconButton
              onClick={() => setView('hours')}
              color={error ? 'error' : 'inherit'}
              size="small"
            >
              <TimerText>{pad(hours)}</TimerText>
            </IconButton>
            <Typography
              px={1}
              fontWeight="bold"
              fontSize={18}
              color={error ? 'error.main' : 'text.primary'}
            >
              :
            </Typography>
            <IconButton
              onClick={() => setView('minutes')}
              color={error ? 'error' : 'inherit'}
              size="small"
            >
              <TimerText>{pad(minutes)}</TimerText>
            </IconButton>
          </Box>
          <Box
            sx={{
              border: (t) =>
                `1px solid ${error ? t.palette.error.main : t.palette.divider}`,
              p: 1,
              borderRadius: 1,
            }}
          >
            <TimeClock
              {...otherProps}
              minTime={minTime}
              view={view}
              slotProps={{
                previousIconButton: {
                  title: 'Heures',
                  onClick: () => setView('hours'),
                },
                nextIconButton: {
                  title: 'Minutes',
                  onClick: () => setView('minutes'),
                },
              }}
              //onViewChange={(view) => null}
              id="meeting-time-clock"
              ref={ref}
              showViewSwitcher
              ampm={false}
              sx={{
                border: (theme) =>
                  '1px solid ' + error
                    ? theme.palette.error.main
                    : 'transparent',
                borderRadius: 1,
                width: '100%',
                color: 'error.main',
              }}
            />
            <Typography align="center" color="text.secondary">
              {view === 'hours' ? 'Heures' : 'Minutes'}
            </Typography>
          </Box>
        </Box>
      </LocalizationProvider>
    );
  }
);

const TimerText = ({ children }) => {
  return (
    <span
      style={{
        fontSize: 20,
        display: 'inline-block',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </span>
  );
};

TimerText.propTypes = {
  children: PropTypes.node,
};

DateTimeClockMeeting.displayName = 'DateTimeClockMeeting';

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
