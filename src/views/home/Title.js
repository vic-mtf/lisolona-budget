import React from "react";
import { Stack, Divider, CardMedia } from "@mui/material";
import Typography from "../../components/Typography";
import logo from "../../assets/geid_logo_blue_without_title.webp";

export default function Title() {
  return (
    <Stack
      spacing={1}
      direction='row'
      width='100%'
      mt={2}
      divider={
        <Divider
          flexItem
          orientation='vertical'
          sx={{
            bgcolor: "text.secondary",
            borderWidth: 1,
          }}
        />
      }
      display='flex'
      // justifyContent="center"
    >
      <img src={logo} style={{ width: 100 }} />
      <Typography noWrap variant='h5'>
        Lisolo Na Budget
      </Typography>
    </Stack>
  );
}
