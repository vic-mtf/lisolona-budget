import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import ListAvatar from "../../../../components/ListAvatar";
import PropTypes from "prop-types";
import DateCalendarMeeting from "./DateCalendarMeeting";
import TimeClockMeeting from "./DateTimeClockMeeting";
import scrollBarSx from "../../../../utils/scrollBarSx";
import TimeDurationMeeting from "./TimeDurationMeeting";
import { Controller } from "react-hook-form";
import FormHelperErrorText from "../../../../components/FormHelperErrorText";
import dayjs from "dayjs";

export default function ScheduledMeetingForm({
  data,
  register,
  control,
  errors,
}) {
  return (
    <Box
      maxHeight='100%'
      overflow='auto'
      px={1}
      display='flex'
      flexDirection='column'
      position='relative'
      sx={{ ...scrollBarSx, scrollbarGutter: "stable both-edges" }}
      flex={1}
      gap={2.5}>
      <ListItem
        disableGutters
        sx={{
          position: "sticky",
          top: 0,
          backdropFilter: "blur(10px)",
          zIndex: (theme) => theme.zIndex.appBar,
        }}>
        <ListItemAvatar>
          <div>
            <ListAvatar
              src={data?.image}
              alt={data?.name}
              id={data?.id}
              invisible>
              {data?.name?.toUpperCase()?.charAt(0)}
            </ListAvatar>
          </div>
        </ListItemAvatar>
        <ListItemText
          primary={data?.name}
          primaryTypographyProps={{
            variant: "h6",
            fontSize: 18,
            fontWeight: "bold",
          }}
        />
      </ListItem>
      <Box>
        <TextField
          label='Intitulé'
          fullWidth
          name='title'
          {...register("title", {
            required: "Saississez une intutilé",
          })}
          color={errors?.title?.message ? "error" : "primary"}
        />
        <FormHelperErrorText>{errors?.title?.message}</FormHelperErrorText>
      </Box>

      <Controller
        control={control}
        rules={{ required: "Choisissez une date" }}
        name='date'
        render={({ field }) => (
          <>
            <Box>
              <DateCalendarMeeting {...field} error={errors?.date} />
              <FormHelperErrorText>{errors?.date?.message}</FormHelperErrorText>
            </Box>
            <Box>
              <Controller
                name='time'
                control={control}
                rules={{ required: "Veuillez selectionner l'heure" }}
                render={({ field: clockField }) => (
                  <TimeClockMeeting
                    {...clockField}
                    error={errors?.time}
                    calendarDate={field.value}
                    minTime={
                      dayjs().format("YYYY/DD/MM") ===
                      dayjs(field?.value || undefined).format("YYYY/DD/MM")
                        ? dayjs()
                        : undefined
                    }
                  />
                )}
              />
              <FormHelperErrorText>{errors?.time?.message}</FormHelperErrorText>
            </Box>
          </>
        )}
      />
      <Box>
        <Controller
          name='duration'
          control={control}
          rules={{ required: "Préssisez la durée" }}
          render={({ field }) => (
            <TimeDurationMeeting {...field} error={errors?.duration} />
          )}
        />
        <FormHelperErrorText>{errors?.duration?.message}</FormHelperErrorText>
      </Box>
      <Box>
        <TextField
          label='Déscription'
          multiline
          rows={6}
          name='description'
          fullWidth
          color={errors?.description?.message ? "error" : "primary"}
          {...register("description", {
            required: "Décrivez la réunion",
          })}
        />
        <FormHelperErrorText>
          {errors?.description?.message}
        </FormHelperErrorText>
      </Box>
    </Box>
  );
}

ScheduledMeetingForm.propTypes = {
  data: PropTypes.object,
  register: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
};
