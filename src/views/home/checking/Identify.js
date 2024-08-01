import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Toolbar, TextField, Tooltip } from "@mui/material";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import Typography from "../../../components/Typography";
import Button from "../../../components/Button";
import { useDispatch } from "react-redux";

import useHandleJoinMeeting from "../../main/action/useHandleJoinMeeting";

import IconButton from "../../../components/IconButton";
import { useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { CHANNEL } from "../Home";
import { setData } from "../../../redux/meeting";
import { updateValues } from "../../../redux/user";

const Identify = ({ loading, refetch, codeRef }) => {
  const nameRef = useRef();
  const [disabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const handleJoinMeeting = useHandleJoinMeeting("guest");

  const handleGetData = (event) => {
    event.preventDefault();
    const name = nameRef?.current?.value?.trim();
    if (name?.length > 2) {
      refetch({
        url: "api/chat/room/call/register",
        method: "POST",
        data: {
          name: nameRef?.current?.value?.trim(),
        },
      }).then(async ({ data }) => {
        const code = codeRef?.current;
        const { name, _id, token } = data;
        const user = {
          id: _id,
          name,
          token,
        };
        dispatch(updateValues(user));
        dispatch(setData({ data: { me: user } }));
        const result = await refetch({
          headers: { Authorization: `Bearer ${token}` },
          url: "/api/chat/room/call/" + code,
          method: "GET",
        });
        const event = "_open_meeting_sub_window";
        const customEvent = new CustomEvent(event, {
          detail: {
            name: event,
            subWindow: handleJoinMeeting({
              data: {
                id: result?.data?.room?._id,
                name: result?.data?.room?.name,
                avatarSrc: result?.data?.room?.image,
                type: "room",
              },
              origin: result.data,
            }),
          },
        });
        CHANNEL.dispatchEvent(customEvent);
        dispatch(
          setData({
            data: { mode: data?.mode },
          })
        );
      });
    }
  };

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
    <Toolbar
      disableGutters
      variant='dense'
      component='form'
      onSubmit={handleGetData}
      sx={{
        m: 0,
        p: 0,
        gap: 1,
      }}>
      <Tooltip title='Retour' arrow>
        <IconButton onClick={() => navigateTo("/home")}>
          <ArrowBackOutlinedIcon />
        </IconButton>
      </Tooltip>
      <TextField
        size='small'
        label='Nom complet'
        variant='outlined'
        type='text'
        name='name'
        placeholder='Ex: Viael Mongolo Tanzey'
        inputRef={nameRef}
        onChange={handleChange}
      />
      <Button
        variant='outlined'
        disabled={disabled}
        size='medium'
        endIcon={<LaunchOutlinedIcon />}
        type='submit'>
        Participer
      </Button>
    </Toolbar>
  );
};

export default Identify;
