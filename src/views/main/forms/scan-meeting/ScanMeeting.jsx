import React, { useCallback } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { IconButton, Box, Typography, Toolbar, Stack } from "@mui/material";
import PropTypes from "prop-types";
import LinearProgressLayer from "../../../../components/LinearProgressLayer";
import useAxios from "../../../../hooks/useAxios";
import useToken from "../../../../hooks/useToken";
import { useForm } from "react-hook-form";
import CodeScanner from "./CodeScanner";

const ScanMeeting = React.memo(({ onClose }) => {
  const Authorization = useToken();
  const [{ loading }, refetch] = useAxios(
    {
      method: "POST",
      url: "/api/chat/invite",
      headers: { Authorization },
    },
    { manual: true }
  );

  const {
    //register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const onSubmit = useCallback(
    async ({ email: targetMail }) => {
      const data = { targetMail, object: "connexion" };
      try {
        await refetch({ data });
      } catch (e) {
        console.error(e);
      }
    },
    [refetch]
  );

  return (
    <>
      <LinearProgressLayer open={loading} />
      <Box
        component='form'
        overflow='hidden'
        height='100%'
        width='100%'
        display='flex'
        flexDirection='column'
        autoFocus={!loading}
        onSubmit={handleSubmit(onSubmit)}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={onClose}
            aria-label='close'
            disabled={loading}>
            <CloseOutlinedIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Rejoindre une reunion par le QrCode
          </Typography>
        </Toolbar>
        <Box
          overflow='auto'
          position='relative'
          minHeight={{ md: 250 }}
          flex={1}
          width={{ md: 450, xs: "100%" }}>
          <Stack p={2} spacing={4}>
            <Typography color='text.secondary'>
              Scannez le code QR fourni par l’hôte pour rejoindre la réunion.
            </Typography>
            <Box overflow='hidden' position='relative' display='flex'>
              <CodeScanner />
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
});

ScanMeeting.displayName = "ScanMeeting";
ScanMeeting.propTypes = {
  onClose: PropTypes.func,
};

export default ScanMeeting;
