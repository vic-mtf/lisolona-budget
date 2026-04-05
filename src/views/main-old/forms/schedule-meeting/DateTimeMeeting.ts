import React, { useCallback, useMemo, useState } from 'react';
import { Box as MuiBox } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import Typography from '../../../../components/Typography';
import { Controller } from'react-hook-form';

export const getHMToDate = (date = Date.now()) => {
    const time = new Date(date);
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export default function TimeClockMeeting({ readOnly, disabled, control }) {
    const [startTime, setStartTime] = useState(dayjs(new Date()));
    const [endTime, setEndTime] = useState(dayjs(new Date(Date.now() + 60 * 60000)));
    const [active, setActive] = useState(null);

    const onChange = (type, onChange) => (value) => {
        const types = {
            startedAt: {
                action: setStartTime,
            },
            endedAt: {
               action: setEndTime,
            },
        };
        const { action } = types[type];
        if(typeof action === 'function')
            action(value);
        if(typeof onChange === 'function') {
            onChange(value);
        }
    };
    
    // const onBlur = type => () => {
    //     if(active === type) setActive(null);
    // }

    const onFocus = type => () => {
        if(active!== type) setActive(type);
    }

    const value = useMemo(() => active === 'startedAt' ? startTime : endTime, [active, startTime, endTime]);
    const inputStyle = useCallback((typeFocus) => {
        // border: theme => `4px dotted  ${typeFocus === active ? theme.palette.primary.main : 'transparent'}`,
        const getColor = theme => typeFocus === active ? theme.palette.primary.main : 'transparent';
        return { 
            background: theme =>
                `linear-gradient(90deg, ${getColor(theme)} 50%, transparent 0) repeat-x,
                linear-gradient(90deg, ${getColor(theme)} 50%, transparent 0) repeat-x,
                linear-gradient(0deg, ${getColor(theme)} 50%, transparent 0) repeat-y,
                linear-gradient(0deg, ${getColor(theme)} 50%, transparent 0) repeat-y`,
                backgroundSize: '4px 2px, 4px 2px, 2px 4px, 2px 4px',
                backgroundPosition: '0 0, 0 100%, 0 0, 100% 0',
                animation: 'linearGradientMove .2s infinite linear',
                p: .5,
        }
    }, [active]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
         <Controller
            name={active || 'startedAt'}
            control={control}
            key={active}
            render={({ field, formState: { defaultValues } }) => (
                <TimeClock 
                    key={active}
                    ref={field.ref}
                    value={field.value} 
                    defaultValue={defaultValues[active]}
                    views={['hours', 'minutes']} 
                    showViewSwitcher
                    onChange={onChange(active, field.onChange)} 
                    disabled={!active || disabled}
                    readOnly={readOnly}
                />
            )}
        />
        <MuiBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
        >
         <Typography
            component="span"
         >De</Typography>
            <Controller
                name="startedAt"
                control={control}
                render={({ field, formState: { defaultValues } }) => (
                    <TimeField
                        value={field.value}
                        onChange={onChange('startedAt', field.onChange)}
                        defaultValue={defaultValues?.startedAt}
                        size="small"
                        format="HH:mm"
                        onFocus={onFocus('startedAt')}
                        readOnly={readOnly}
                        disabled={disabled}
                        onBlur={field.onBlur}
                        sx={{
                            ...inputStyle('startedAt'),
                            width: 80,
                            '& input': {
                            textAlign: 'center',
                            }
                        }}
                    />
                )}
            />
            
            <Typography
                component="span"
            >à</Typography>
            <Controller
                name="endedAt"
                control={control}
                render={({ field, formState: { defaultValues } }) => (
                    <TimeField
                        value={field.value}
                        defaultValue={defaultValues?.endedAt}
                        onChange={onChange('endedAt', field.onChange)}
                        size="small"
                        format="HH:mm"
                        onFocus={onFocus('endedAt')}
                        readOnly={readOnly}
                        disabled={disabled}
                        onBlur={field.onBlur}
                        sx={{
                            ...inputStyle('endedAt'),
                            width: 80,
                            '& input': { textAlign: 'center', }
                        }}
                    />
                )}
            />
        </MuiBox>
       
    </LocalizationProvider>
  );
}


