import { Box, Toolbar, Typography, TextField } from '@mui/material';
import ListAvatar from '../../../../components/ListAvatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PropTypes from 'prop-types';
import DateCalendarMeeting from './DateCalendarMeeting';
import DateTimeClockMeeting from './DateTimeClockMeeting';
import scrollBarSx from '../../../../utils/scrollBarSx';
import TimeDurationMeeting from './TimeDurationMeeting';
import { Controller, useFormContext } from 'react-hook-form';
import FormHelperErrorText from '../../../../components/FormHelperErrorText';
import SubHeaderIndicator from './SubHeaderIndicator';
import React from 'react';

const ScheduledMeetingForm = ({ data }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Box
      maxHeight="100%"
      overflow="auto"
      px={0}
      display="flex"
      flexDirection="column"
      position="relative"
      sx={{ ...scrollBarSx, scrollbarGutter: 'stable both-edges' }}
      flex={1}
      gap={2.5}
    >
      <Toolbar
        disableGutters
        sx={{
          px: 1,
          position: 'sticky',
          alignItems: 'start',
          top: 0,
          backdropFilter: 'blur(10px)',
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <ListItemAvatar>
          <ListAvatar
            src={data?.image}
            alt={data?.name}
            id={data?.id}
            invisible
            key={data?.id}
          >
            {data?.name?.toUpperCase()?.charAt(0)}
          </ListAvatar>
        </ListItemAvatar>
        <Box>
          <Typography fontWeight="bold" fontSize={18}>
            {data?.name}
          </Typography>
          <Typography
            variant="body2"
            width="100%"
            color="text.secondary"
            height={20}
            display="inline-flex"
          >
            <SubHeaderIndicator />
          </Typography>
        </Box>
      </Toolbar>
      <Box px={1} display="flex" flexDirection="column" gap={4}>
        <Box>
          <TextField
            label="Intitulé"
            fullWidth
            name="title"
            {...register('title', {
              required: 'Saisissez une intitulé',
            })}
            color={errors?.title?.message ? 'error' : 'primary'}
          />
          <FormHelperErrorText>{errors?.title?.message}</FormHelperErrorText>
        </Box>

        <Controller
          control={control}
          rules={{ required: 'Choisissez une date' }}
          name="date"
          render={({ field }) => (
            <Box>
              <DateCalendarMeeting {...field} error={errors?.date} />
              <FormHelperErrorText>{errors?.date?.message}</FormHelperErrorText>
            </Box>
          )}
        />
        <Box>
          <Controller
            name="time"
            control={control}
            rules={{ required: "Veuillez sélectionner l'heure" }}
            render={({ field: clockField }) => (
              <DateTimeClockMeeting {...clockField} error={errors?.time} />
            )}
          />
          <FormHelperErrorText>{errors?.time?.message}</FormHelperErrorText>
        </Box>
        <Box>
          <Controller
            control={control}
            rules={{ required: 'Précisez la durée' }}
            name="duration"
            render={({ field }) => (
              <TimeDurationMeeting {...field} error={errors?.duration} />
            )}
          />
          <FormHelperErrorText>{errors?.duration?.message}</FormHelperErrorText>
        </Box>
        <Box>
          <TextField
            label="Description"
            multiline
            rows={6}
            name="description"
            fullWidth
            color={errors?.description?.message ? 'error' : 'primary'}
            {...register('description', {
              required: 'Décrivez la réunion',
            })}
          />
          <FormHelperErrorText>
            {errors?.description?.message}
          </FormHelperErrorText>
        </Box>
      </Box>
    </Box>
  );
};

ScheduledMeetingForm.propTypes = {
  data: PropTypes.object,
};

export default React.memo(ScheduledMeetingForm);
