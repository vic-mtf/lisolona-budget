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
import PropTypes from "prop-types";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import LinearProgressLayer from "../../../../components/LinearProgressLayer";
import useAxios from "../../../../hooks/useAxios";
import useToken from "../../../../hooks/useToken";
import { useForm } from "react-hook-form";
import CreateGroup from "./CreateGroup";
import ContactList from "./ContactList";

const CreateDiscussionGroup = React.memo(({ onClose }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
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
  } = useForm();

  const onSubmit = useCallback(
    (data) => {
      refresh;
      // create group with refresh
    },
    [refresh]
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
              <ContactList
                selectedContacts={selectedContacts}
                setSelectedContacts={setSelectedContacts}
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
            <Button
              variant='outlined'
              disabled={!selectedContacts.length}
              onClick={() => setTab("create")}
              endIcon={<NavigateNextOutlinedIcon />}>
              Suivant
            </Button>
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

CreateDiscussionGroup.propTypes = {
  onClose: PropTypes.func,
};

export default CreateDiscussionGroup;
