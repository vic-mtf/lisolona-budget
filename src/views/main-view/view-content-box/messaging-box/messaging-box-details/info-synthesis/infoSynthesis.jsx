import { Divider, Stack } from "@mui/material";
import ProfileAvatar from "./ProfileAvatar";
import Summary from "./Summary";
import MediaView from "./MediaView";

const InfoSynthesis = () => {
  return (
    <Stack width='100%'>
      <ProfileAvatar />

      <Summary />
      <MediaView />

      {/* <Toolbar sx={{ gap: 2, position: '' }}>
        <IconButton
          onClick={() => {
            const key = "app.actions.messaging.info.open";
            store.dispatch(updateData({ data: false, key }));
          }}>
          <CloseOutlinedIcon />
        </IconButton>
        <Typography variant='h5'>Infos</Typography>
      </Toolbar> */}
    </Stack>
  );
};

export default InfoSynthesis;
