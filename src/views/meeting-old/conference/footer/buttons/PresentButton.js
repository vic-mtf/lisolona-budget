import ViewCarouselOutlinedIcon from "@mui/icons-material/ViewCarouselOutlined";
// import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
//import BackHandOutlinedIcon from "@mui/icons-material/BackHandOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import IconButton from "../../../../../components/IconButton";
import { Badge, Stack, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setConferenceData } from "../../../../../redux/conference";
// import {useState } from "react";
// import { setConferenceData } from "../../../../../redux/conference";
// import useAudio from "../../../../../hooks/useAudio";
// import message_signal_audio from "../../../../../assets/miui12dr_m5r75343.webm";

export default function PresentButton() {
  const selected = useSelector((store) => store.conference.presenting);
  const dispatch = useDispatch();

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={0.1}>
      <Tooltip title='Messages' arrow>
        <div>
          <IconButton
            size='small'
            color='primary'
            selected={selected}
            onClick={() =>
              dispatch(
                setConferenceData({
                  data: { presenting: !selected, pinId: null },
                })
              )
            }
            sx={{
              zIndex: 0,
              borderRadius: 1,
              boxShadow: "none",
            }}>
            <Badge
              sx={{
                "& .MuiBadge-badge": {
                  border: (theme) =>
                    `1px solid ${theme.palette.background.paper}`,
                },
              }}
              badgeContent={0}
              color='primary'>
              <ViewCarouselOutlinedIcon />
            </Badge>
          </IconButton>
        </div>
      </Tooltip>
    </Stack>
  );
}
