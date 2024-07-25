import {
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box as MuiBox,
} from "@mui/material";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import DateCalendarMeeting from "./DateCalendarMeeting";
import TimeClockMeeting from "./DateTimeMeeting";
import LinearProgressLayer from "../../../../components/LinearProgressLayer";
import Button from "../../../../components/Button";
import useAxios from "../../../../utils/useAxios";
import dayjs from "dayjs";
import PropTypes from "prop-types";

export default function ScheduleMeetingContent({ target, onClose, formRef }) {
  const token = useSelector((store) => store.user.token);
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      date: new Date(),
      startedAt: dayjs(Date()),
      endedAt: dayjs(new Date(Date.now() + 60 * 60000)),
    },
  });

  const [{ loading }, refetch] = useAxios(
    {
      url: "/api/chat/room/call/",
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
    { manual: true },
  );

  const handleCreateMeetingRequest = useCallback(
    async (fields) => {
      const getDate = (HM) => {
        const date = new Date(fields.date);
        const HMDate = new Date(HM);
        date.setHours(HMDate.getHours());
        date.setMinutes(HMDate.getMinutes());
        return date;
      };

      const data = {
        target: target?.id,
        type: target?.type,
        tokenType: "uid",
        role: "publisher",
        scheduled: true,
        startedAt: getDate(fields.startedAt?.toString()),
        endedAt: getDate(fields.endedAt?.toString()),
        title: fields.title,
        description: fields.description,
      };

      try {
        await refetch({ data });
      } catch (e) {
        console.error(e);
      }
      onClose(null);
    },
    [target, refetch, onClose],
  );

  useEffect(() => {
    const form = formRef?.current;
    const onSubmit = handleSubmit(handleCreateMeetingRequest);
    form?.addEventListener("submit", onSubmit);
    return () => {
      form?.removeEventListener("submit", onSubmit);
    };
  }, [formRef, handleSubmit, handleCreateMeetingRequest]);

  return (
    <>
      <LinearProgressLayer open={loading} />
      <DialogTitle>Planifier une réunion</DialogTitle>
      <DialogContent>
        <TextField
          type="text"
          variant="outlined"
          label="Titre"
          fullWidth
          disabled={loading}
          sx={{ my: 1 }}
          inputProps={{ readOnly: loading }}
          {...register("title")}
        />
        <MuiBox display="flex" flexDirection="row">
          <MuiBox>
            <Controller
              name="date"
              control={control}
              render={({
                field,
                formState: {
                  defaultValues: { date },
                },
              }) => <DateCalendarMeeting {...field} defaultValue={date} />}
            />
          </MuiBox>
          <MuiBox>
            <TimeClockMeeting control={control} />
          </MuiBox>
        </MuiBox>
        <TextField
          multiline
          variant="outlined"
          label="Description"
          minRows={5}
          fullWidth
          sx={{ my: 1 }}
          disabled={loading}
          inputProps={{ readOnly: loading }}
          {...register("description")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button variant="outlined" disabled={loading} type="submit">
          Confirmer
        </Button>
      </DialogActions>
    </>
  );
}

ScheduleMeetingContent.propTypes = {
  target: PropTypes.object,
  onClose: PropTypes.func,
  formRef: PropTypes.object,
};
