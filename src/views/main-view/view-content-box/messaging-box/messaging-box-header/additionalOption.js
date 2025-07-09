import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import store from "../../../../../redux/store";
import { updateData } from "../../../../../redux/data/data";

export const fullOptions = [
  {
    id: "close",
    label: "Fermer la discussion",
    icon: CloseOutlinedIcon,
    action() {
      store.dispatch(
        updateData({
          data: [null, null, false],
          key: [
            "discussionTarget",
            "targetView",
            "app.actions.messaging.info.open",
          ],
        })
      );
    },
  },
  {
    id: "delete",
    label: "Supprimer la discussion",
    icon: DeleteOutlinedIcon,
    disabled: true,
  },
];

export const groupOptions = [
  {
    id: "info",
    label: "Infos Lisanga",
    icon: InfoOutlinedIcon,
    action() {
      const key = "app.actions.messaging.info.open";
      store.dispatch(updateData({ data: true, key }));
    },
  },
  {
    id: "leave",
    label: "Quitter Lisanga",
    icon: ExitToAppOutlinedIcon,
    disabled: true,
  },
];

export const contacts = [
  {
    id: "info",
    label: "Infos du contact",
    icon: InfoOutlinedIcon,
    action() {
      const key = "app.actions.messaging.info.open";
      store.dispatch(updateData({ data: true, key }));
    },
  },
  {
    id: "remove",
    label: "Retirer de vos contact",
    disabled: true,
    icon: BlockOutlinedIcon,
  },
];

export const otherOptions = [
  {
    id: "select",
    label: "Selectionner les messages",
    icon: CheckBoxOutlinedIcon,
  },
];
