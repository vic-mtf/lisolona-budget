import React from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateData } from "../../../../redux/data/data";
import useToken from "../../../../hooks/useToken";
import { useNotifications } from "@toolpad/core/useNotifications";
import store from "../../../../redux/store";
import useAxios from "../../../../hooks/useAxios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const DeleteInvitationButton = ({ data: _data, onClose }) => {
  const notifications = useNotifications();
  const dispatch = useDispatch();

  const Authorization = useToken();
  const [{ loading }, refetch] = useAxios(
    { method: "POST", headers: { Authorization } },
    { manual: true }
  );

  const handleSubmitResponse = async () => {
    const notice = {};
    try {
      await refetch({
        url: "api/chat/reject",
        data: { _id: _data?.id },
      });
      notice.message = "L'invitation a été supprimée";
      notice.severity = "success";
      const flr = (n) => n?.id !== _data?.id;
      const data = store.getState().data.app.notifications.filter(flr);

      dispatch(updateData({ data: { app: { notifications: data } } }));
    } catch (e) {
      console.error(e);
      notice.message = "Nous n'avons pas pu supprimer l'invitation";
      notice.severity = "error";
    }
    notifications.show(notice.message, { severity: notice.severity });
    if (typeof onClose === "function") onClose();
  };

  return (
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
  );
};

export default React.memo(DeleteInvitationButton);
