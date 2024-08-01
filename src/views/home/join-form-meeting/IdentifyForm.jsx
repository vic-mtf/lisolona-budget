import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { TextField, Box } from "@mui/material";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import Button from "../../../components/Button";
// import { useDispatch } from "react-redux";
// import useHandleJoinMeeting from "../../main/action/useHandleJoinMeeting";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";

// import { useNavigate } from "react-router-dom";

// import { CHANNEL } from "../Home";
// import { setData } from "../../../redux/meeting";
// import { updateUser } from "../../../redux/user";

export default function IdentifyForm({ loading, refetch }) {
  const nameRef = useRef();
  const [disabled, setDisabled] = useState(true);
  // const dispatch = useDispatch();
  // const navigateTo = useNavigate();
  // const handleJoinMeeting = useHandleJoinMeeting("guest");

  // const handleGetData = useCallback((event) => {
  //   event.preventDefault();
  //   const name = nameRef?.current?.value?.trim();
  //   if (name?.length > 2) {
  //     refetch({
  //       url: "api/chat/room/call/register",
  //       method: "POST",
  //       data: {
  //         name: nameRef?.current?.value?.trim(),
  //       },
  //     }).then(async ({ data }) => {
  //       const { name, _id: id, token } = data;
  //       dispatch(updateUser({ data: { id, name, token } }));
  //       const Authorization = `Bearer ${token}`;
  //       const result = await refetch({
  //         headers: { Authorization },
  //         url: "/api/chat/room/call/" + data.meetingCode,
  //         method: "GET",
  //       });
  //       const event = "_open_meeting_sub_window";
  //       const customEvent = new CustomEvent(event, {
  //         detail: {
  //           name: event,
  //           subWindow: handleJoinMeeting({
  //             data: {
  //               id: result?.data?.room?._id,
  //               name: result?.data?.room?.name,
  //               avatarSrc: result?.data?.room?.image,
  //               type: "room",
  //             },
  //             origin: result.data,
  //           }),
  //         },
  //       });
  //       CHANNEL.dispatchEvent(customEvent);
  //       dispatch(
  //         setData({
  //           data: { mode: data?.mode },
  //         })
  //       );
  //     });
  //   }
  // }, []);

  const handleChange = useCallback(() => {
    const name = nameRef.current.value?.trim();
    const isCorrect = name?.length > 1;
    if (isCorrect && disabled) setDisabled(false);
    if (!isCorrect && !disabled) setDisabled(true);
  }, [disabled]);

  useLayoutEffect(() => {
    handleChange();
  }, [handleChange]);

  return (
    <Box
      display='flex'
      gap={1}
      sx={{
        flexDirection: { xs: "column", md: "row" },

        width: "100%",
      }}>
      <TextField
        size='small'
        label='Nom complet'
        variant='outlined'
        type='text'
        name='name'
        placeholder='Ex: Viael Mongolo Tanzey'
        inputRef={nameRef}
        onChange={handleChange}
        sx={{ minWidth: { xs: "auto", md: 300 } }}
      />
      <Box display='flex' flexDirection='row' gap={1}>
        <Button
          variant='outlined'
          disabled={disabled}
          size='medium'
          endIcon={<LaunchOutlinedIcon />}
          startIcon={<CoPresentOutlinedIcon />}
          type='submit'>
          Participer à la réunion
        </Button>
      </Box>
    </Box>
  );
}
