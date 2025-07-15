import React, { useState, useMemo } from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useNotifications } from "@toolpad/core/useNotifications";
import useToken from "../../../../hooks/useToken";
import { timeElapses } from "../../../../utils/formatDate";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import {
  Box,
  Button,
  IconButton,
  ListItem,
  CardActions,
  Stack,
  Tooltip,
  AlertTitle,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PropTypes from "prop-types";
import ListAvatar from "../../../../components/ListAvatar";
import { axios } from "../../../../hooks/useAxios";
import useLocalStoreData from "../../../../hooks/useLocalStoreData";
import { useDispatch } from "react-redux";
import { updateData } from "../../../../redux/data/data";
import getFullName from "../../../../utils/getFullName";
import { NAVIGATE_EVENT_NAME } from "../../navigation/NavTab";
import store from "../../../../redux/store";

const GuestItem = React.memo(({ id, user, divider, createdAt, isRemote }) => {
  const name = getFullName(user);

  return (
    <div>
      <ListItem
        //   disablePadding
        alignItems='flex-start'
        secondaryAction={
          <Tooltip title='Datail'>
            <IconButton edge='end'>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        }>
        <ListItemAvatar>
          <ListAvatar src={user?.image} alt={name} id={user?.id} invisible>
            {name?.toUpperCase()?.charAt(0)}
          </ListAvatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction='row' spacing={1}>
              <Box
                flexGrow={1}
                sx={{
                  "& > div": {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}>
                <div>
                  <Typography component='span' variant='body1'>
                    {name}
                  </Typography>{" "}
                  <Typography
                    component='span'
                    color='text.secondary'
                    variant='body2'>
                    {isRemote
                      ? "souhaite entrer en contact avec vous"
                      : " a bien reçu votre invitation. En attente de confirmation"}{" "}
                  </Typography>
                </div>
                <Typography
                  variant='caption'
                  component='div'
                  color='text.secondary'>
                  {timeElapses({ date: createdAt })}
                </Typography>
              </Box>
            </Stack>
          }
          secondary={
            <div>
              <GuestActionButtons user={user} id={id} isRemote={isRemote} />
            </div>
          }
          slotProps={{
            primary: { component: "div" },
            secondary: { component: "div" },
          }}
        />
      </ListItem>
      <Divider variant='inset' sx={{ opacity: divider ? 1 : 0 }} />
    </div>
  );
});

const GuestActionButtons = ({ id, user, isRemote }) => {
  const key = useMemo(() => `app.requests.${id}`, [id]);
  const [getData, setData] = useLocalStoreData();
  const [loading, setLoading] = useState(Boolean(getData(key)?.loading));
  const notifications = useNotifications();
  const dispatch = useDispatch();
  const Authorization = useToken();

  const handleConfirm = async () => {
    const notice = {};
    try {
      setLoading(true);
      setData(key, { loading: true });
      await axios({
        method: "POST",
        headers: { Authorization },
        url: "api/chat/accept",
        data: { _id: id },
      });
      notice.message = (
        <>
          <AlertTitle>{"L'invitation acceptée"}</AlertTitle>
          <b>{getFullName(user)}</b> a été ajouté dans vos contacts
        </>
      );
      notice.severity = "success";
      delete getData("app.requests")[id];
      const flr = (n) => n?.id != id;
      const data = store.getState().data.app.notifications.filter(flr);
      dispatch(updateData({ data: { app: { notifications: data } } }));
    } catch (error) {
      console.error(error);
      notice.message = "Nous n'avons pas pu confirmer l'invitation";
      notice.severity = "error";
      setLoading(false);
      setData(key, { loading: false });
    }
    notifications.show(notice.message, {
      severity: notice.severity,
      key: id,
      ...(notice.severity === "success" && {
        onAction: () => {
          dispatch(
            updateData({
              key: `app.actions.contacts.blink.${user?.id}`,
              data: true,
            })
          );
          notifications.close(id);

          const manuelEvent = new CustomEvent(NAVIGATE_EVENT_NAME, {
            detail: { name: NAVIGATE_EVENT_NAME, tab: "contacts" },
          });
          document.getElementById("root").dispatchEvent(manuelEvent);
        },
        actionText: "Voir plus",
      }),
    });
    // dispatch(updateData({ key, data: false }));
  };

  return (
    <CardActions sx={{ justifyContent: "flex-end", display: "flex" }}>
      <Button
        disabled={loading || !isRemote}
        onClick={() => {
          dispatch(
            updateData({
              key: "app.actions.notifications.confirmDelete",
              data: { user, id },
            })
          );
        }}>
        {isRemote ? "Supprimer" : "Abandonner"}
      </Button>
      {isRemote && (
        <Button
          variant='outlined'
          disabled={loading}
          onClick={handleConfirm}
          endIcon={<ThumbUpAltOutlinedIcon />}>
          Confirmer
        </Button>
      )}
    </CardActions>
  );
};

GuestActionButtons.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  user: PropTypes.object,
  isRemote: PropTypes.bool,
};
GuestItem.displayName = "GuestItem";

GuestItem.propTypes = {
  // selected: PropTypes.bool,
  user: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  divider: PropTypes.bool,
  //checkable: PropTypes.bool,
  isRemote: PropTypes.bool,
  createdAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
};

export default GuestItem;
