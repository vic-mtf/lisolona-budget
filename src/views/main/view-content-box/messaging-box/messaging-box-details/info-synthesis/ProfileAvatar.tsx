import React from "react";
import store from "@/redux/store";
import {
  alpha,
  Avatar,
  Box,
  CardActionArea,
  Divider,
  IconButton,
  ImageListItemBar,
  Stack,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { updateData } from "@/redux/data/data";
import { useMemo } from "react";
import ListAvatar from "@/components/ListAvatar";
import capStr from "@/utils/capStr";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import useMessagingContext from "@/hooks/useMessagingContext";

const ProfileAvatar = React.memo(() => {
  const [{ user, contact }] = useMessagingContext();
  const localUser = useMemo(() => store.getState().user, []);
  const userAsMember = user?.members?.find(({ id }) => id === localUser?.id);
  const image = user?.image || contact?.image;
  const isAdmin = userAsMember?.level === "admin";

  const titleAndSubTitle = useMemo(() => {
    const title = user?.name;
    const subTitle = user?.type === "room" ? user?.description : contact?.email;
    return (
      <Box maxWidth='80%'>
        <Typography
          variant='body1'
          align={image ? "left" : "center"}
          noWrap
          textOverflow='ellipsis'>
          {title}
        </Typography>
        <Typography
          color='text.secondary'
          align={image ? "left" : "center"}
          sx={{
            width: "100%",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          title={subTitle}>
          {subTitle}
        </Typography>
      </Box>
    );
  }, [contact, user, image]);

  return (
    <Box
      position='relative'
      sx={{ aspectRatio: 1, width: "100%", position: "relative" }}>
      <CardActionArea
        sx={{
          width: "100%",
          height: "100%",
          display: image ? "block" : "none",
        }}>
        <Avatar
          sx={{ width: "100%", height: "100%" }}
          variant='square'
          src={image}
        />
        <Divider />
      </CardActionArea>

      <ImageListItemBar
        sx={(theme) => {
          const color =
            theme.palette.common[
              theme.palette.mode === "dark" ? "black" : "white"
            ];
          const topColor = alpha(color, 0.6);
          return {
            background: `linear-gradient(to bottom, ${topColor} 0%, transparent 70%,  transparent) 100%`,
          };
        }}
        title={
          <Stack direction='row' alignItems='center' spacing={2}>
            <IconButton
              onClick={() => {
                const key = "app.actions.messaging.info.open";
                store.dispatch(updateData({ data: false, key }));
              }}>
              <CloseOutlinedIcon />
            </IconButton>
            <Typography variant='h6' flexGrow={1} fontSize={18}>
              Infos {user?.type === "room" ? "Lisanga" : "du contact"}
            </Typography>
            {isAdmin && (
              <IconButton>
                <EditOutlinedIcon />
              </IconButton>
            )}
          </Stack>
        }
        position='top'
        actionPosition='left'
      />
      {image ? (
        <ImageListItemBar
          sx={(theme) => {
            const color =
              theme.palette.common[
                theme.palette.mode === "dark" ? "black" : "white"
              ];
            const topColor = alpha(color, 0.6);
            const bottomColor = alpha(color, 0.6);
            return {
              background: `linear-gradient(to top, ${topColor} 0%, ${bottomColor} 70%,  transparent) 100%`,
            };
          }}
          title={titleAndSubTitle}
          position='bottom'
          //   actionIcon={
          //     <IconButton
          //       sx={{ color: 'white' }}
          //       aria-label={`star ${item.title}`}
          //     >
          //       <StarBorderIcon />
          //     </IconButton>
          //   }
          actionPosition='left'
        />
      ) : (
        <Box
          display='flex'
          height='100%'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
          gap={2}>
          <Box>
            <ListAvatar
              sx={{ width: 100, height: 100, fontSize: 50 }}
              id={user?.id}
              invisible>
              {capStr(user?.name?.charAt(0))}
            </ListAvatar>
          </Box>
          {titleAndSubTitle}
        </Box>
      )}
    </Box>
  );
});

ProfileAvatar.displayName = "ProfileAvatar";

export default ProfileAvatar;
