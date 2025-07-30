import {
  Box,
  Button,
  DialogActions,
  IconButton,
  Toolbar,
  Typography,
  Slide,
} from "@mui/material";
import PropTypes from "prop-types";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DiscussionList from "../../navigation/discussions/DiscussionList";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { useState, useCallback, useMemo } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ScheduledMeetingForm from "./ScheduledMeetingForm";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import LinearProgressLayer from "../../../../components/LinearProgressLayer";
import useToken from "../../../../hooks/useToken";
import useAxios from "../../../../hooks/useAxios";

export default function ScheduledMeeting({ onClose, room = null }) {
  const [data, setData] = useState(room);
  const {
    register,
    control,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({ values: { date: null, time: null, duration: null } });
  const Authorization = useToken();
  const [{ loading }, refetch] = useAxios(
    { url: "/api/chat/room/call/", method: "POST", headers: { Authorization } },
    { manual: true }
  );
  const option = useMemo(
    () => (data ? "scheduled-form" : "contact-list"),
    [data]
  );

  const onSubmit = useCallback(
    async (fields) => {
      const duration = dayjs(fields.duration);
      if (duration.hour() * 60 + duration.minute() < 5) {
        setError("duration", {
          message: "La réunion doit durer au moins 5 minutes.",
        });
        return;
      }

      try {
        const time = dayjs(fields.time);
        const startedAt = dayjs(fields.date)
          .hour(time.hour())
          .minute(time.hour())
          .toDate();
        const endedAt = dayjs(startedAt)
          .add(duration.hour(), "hour")
          .add(duration.minute(), "minute")
          .toDate();
        const call = refetch({
          target: data?.id,
          type: "room",
          tokenType: "uid",
          role: "publisher",
          scheduled: true,
          startedAt,
          endedAt,
          title: fields.title,
          description: fields.description,
        });
        // console.log(call);
      } catch (err) {
        console.error(err);
      }
    },
    [data, setError, refetch]
  );

  return (
    <>
      <Box
        component='form'
        overflow='hidden'
        height='100%'
        width='100%'
        display='flex'
        flexDirection='column'
        onSubmit={handleSubmit(onSubmit)}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            disabled={loading}
            onClick={
              option === "contact-list" || room ? onClose : () => setData(null)
            }
            aria-label='close'
            key={option}>
            {option === "contact-list" || room ? (
              <CloseOutlinedIcon />
            ) : (
              <ArrowBackOutlinedIcon />
            )}
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Planifier une réunion
          </Typography>
        </Toolbar>
        <Box
          overflow='auto'
          position='relative'
          minHeight={{ md: 250 }}
          flex={1}
          width={{ md: 450, xs: "100%" }}>
          <Box
            overflow='hidden'
            position='relative'
            minHeight={{ md: 600, xs: "100%" }}
            flex={1}
            width={{ md: 450 }}
            sx={{
              "& > div": {
                display: "flex",
                overflow: "hidden",
                position: "absolute",
                height: "100%",
                width: "100%",
                flexDirection: "column",
                top: 0,
                left: 0,
              },
            }}>
            <Slide
              in={option === "contact-list"}
              unmountOnExit
              appear={false}
              direction='right'>
              <Box
                display='flex'
                flex={1}
                overflow='hidden'
                flexDirection='column'>
                <Toolbar disableGutters sx={{ px: 2 }} variant='dense'>
                  <Typography color='text.secondary'>
                    Sélectionnez Lisanga avec lequel vous souhaitez planifier la
                    réunion.
                  </Typography>
                </Toolbar>
                <DiscussionList
                  onClose={onClose}
                  closable={false}
                  onClickItem={(_, data) => setData(data)}
                  itemType='group'
                  secondaryAction={(data) => (
                    <IconButton edge='end' onClick={data?.onClick}>
                      <NavigateNextOutlinedIcon />
                    </IconButton>
                  )}
                />
              </Box>
            </Slide>
            <Slide
              in={option === "scheduled-form"}
              unmountOnExit
              appear={false}
              direction='left'>
              <Box
                display='flex'
                flex={1}
                overflow='hidden'
                flexDirection='column'>
                <ScheduledMeetingForm
                  data={data}
                  register={register}
                  control={control}
                  errors={errors}
                  loading={loading}
                />
              </Box>
            </Slide>
          </Box>
        </Box>
        <DialogActions>
          <Button
            variant='outlined'
            endIcon={<CheckOutlinedIcon />}
            disabled={!data || loading}
            type='submit'>
            Enregistrer
          </Button>
        </DialogActions>
      </Box>
      <LinearProgressLayer open={false} />
    </>
  );
}

ScheduledMeeting.propTypes = {
  onClose: PropTypes.func,
  room: PropTypes.object,
};
