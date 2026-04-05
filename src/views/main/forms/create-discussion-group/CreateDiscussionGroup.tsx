import React, { useState, useCallback } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  IconButton,
  DialogActions,
  Button,
  Box,
  Typography,
  Toolbar,
  Slide,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import LinearProgressLayer from "../../../../components/LinearProgressLayer";
import useAxios from "../../../../hooks/useAxios";
import useToken from "../../../../hooks/useToken";
import { Controller, useForm } from "react-hook-form";
import CreateGroup from "./CreateGroup";
import ContactList from "./ContactList";
import store from "../../../../redux/store";
import { useNotifications } from "@toolpad/core/useNotifications";
import NavigationNextButton from "./NavigationNextButton";

const CreateDiscussionGroup = React.memo(({ onClose }) => {
  const notifications = useNotifications();
  const [tab, setTab] = useState("contacts");
  const Authorization = useToken();
  const [{ loading }, refresh] = useAxios(
    {
      method: "POST",
      url: "api/chat/room/new",
      headers: { Authorization },
    },
    { manual: true }
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { members: [] } });

  const onSubmit = useCallback(
    async ({ title: name, description, members: participants }) => {
      if (name && description) {
        const id = store.getState().user.id;
        const members = [id].concat(participants.map(({ id }) => id));
        const data = { name, description, members };
        try {
          await refresh({ data });
          if (typeof onClose === "function") onClose();
        } catch (error) {
          console.error(error);
          notifications.show("Une erreur est survenue, reessayez plus tard", {
            severity: "error",
          });
        }
      }
    },
    [refresh, notifications, onClose]
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
            onClick={tab === "contacts" ? onClose : () => setTab("contacts")}
            aria-label='close'
            key={tab}
            disabled={loading}>
            {tab === "contacts" ? (
              <CloseOutlinedIcon />
            ) : (
              <ArrowBackOutlinedIcon />
            )}
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Créer nouveau Lisanga
          </Typography>
        </Toolbar>
        <Box
          overflow='hidden'
          position='relative'
          minHeight={{ md: 600 }}
          flex={1}
          width={{ md: 450, xs: "100%" }}
          sx={{
            "& > div": {
              display: "flex",
              overflow: "hidden",
              position: "absolute",
              height: "100%",
              width: "100%",
              top: 0,
              left: 0,
            },
          }}>
          <Slide
            in={tab === "contacts"}
            unmountOnExit
            appear={false}
            direction='right'>
            <Box
              display='flex'
              flex={1}
              overflow='hidden'
              flexDirection='column'>
              <Controller
                name='members'
                control={control}
                rules={{
                  validate: (value) =>
                    (Array.isArray(value) && value.length > 0) ||
                    "Add at least one participant",
                }}
                render={({ field: { onChange, value } }) => (
                  <ContactList
                    selectedContacts={value}
                    setSelectedContacts={onChange}
                    control={control}
                  />
                )}
              />
            </Box>
          </Slide>
          <Slide
            in={tab === "create"}
            unmountOnExit
            appear={false}
            direction='left'>
            <Box
              display='flex'
              flex={1}
              overflow='hidden'
              flexDirection='column'>
              <CreateGroup
                register={register}
                control={control}
                errors={errors}
              />
            </Box>
          </Slide>
        </Box>

        <DialogActions>
          {tab === "contacts" && (
            <NavigationNextButton control={control} setTab={setTab} />
          )}
          {tab === "create" && (
            <Button
              variant='outlined'
              disabled={loading}
              type='submit'
              endIcon={<CheckOutlinedIcon />}>
              Créer Lisanga
            </Button>
          )}
        </DialogActions>
      </Box>
    </>
  );
});

CreateDiscussionGroup.displayName = "CreateDiscussionGroup";

export default CreateDiscussionGroup;
