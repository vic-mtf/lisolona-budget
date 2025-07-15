import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { updateData } from "../../../../redux/data/data";
import ListAvatar from "../../../../components/ListAvatar";
import getFullName from "../../../../utils/getFullName";
import useToken from "../../../../hooks/useToken";
import { useNotifications } from "@toolpad/core/useNotifications";
import store from "../../../../redux/store";
import useAxios from "../../../../hooks/useAxios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const ConfirmDeleteGuest = () => {
  const confirmDelete = useSelector(
    (store) => store.data.app.actions.notifications.confirmDelete
  );
  const notifications = useNotifications();
  const dispatch = useDispatch();
  const confirmDeleteMemo = useMemo(() => ({ user: null }), []);

  const handleClose = () => {
    dispatch(
      updateData({ key: "app.actions.notifications.confirmDelete", data: null })
    );
  };

  const Authorization = useToken();
  const [{ loading }, refetch] = useAxios(
    { method: "POST", headers: { Authorization } },
    { manual: true }
  );

  confirmDeleteMemo.user ??= confirmDelete?.user;
  const user = confirmDeleteMemo.user;
  const name = getFullName(confirmDeleteMemo.user);

  const handleSubmitResponse = async () => {
    const notice = {};
    try {
      await refetch({
        url: "api/chat/reject",
        data: { _id: confirmDelete?.id },
      });
      notice.message = "L'invitation a été supprimée";
      notice.severity = "success";
      const flr = (n) => n?.id !== confirmDelete?.id;
      const data = store.getState().data.app.notifications.filter(flr);

      dispatch(updateData({ data: { app: { notifications: data } } }));
    } catch (e) {
      console.error(e);
      notice.message = "Nous n'avons pas pu supprimer l'invitation";
      notice.severity = "error";
    }
    notifications.show(notice.message, { severity: notice.severity });
    handleClose();
  };

  useEffect(() => {
    if (!confirmDelete) confirmDeleteMemo.user = null;
  }, [confirmDelete, confirmDeleteMemo]);

  return (
    <Dialog
      open={Boolean(confirmDelete)}
      onClose={handleClose}
      aria-labelledby='alert-dialog-delete-guest'
      aria-describedby='alert-dialog-confirm-delete'>
      <DialogTitle
        id='alert-dialog-delete-guest'
        sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <ListAvatar src={user?.image} alt={name} id={user?.id}>
          {name?.charAt(0)}
        </ListAvatar>
        {"Supprimer l'invitation"}
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}>
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-confirm-delete'>
          {"Voulez-vous vraiment supprimer l'invitation de"}{" "}
          <Typography color='textPrimary' component='b' fontWeight='bold'>
            {name}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => handleSubmitResponse("reject")}
          autoFocus
          variant='outlined'
          color='error'
          loading={loading}
          disabled={loading}
          endIcon={<DeleteOutlineOutlinedIcon />}>
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ConfirmDeleteGuest);
