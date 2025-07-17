import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import store from "../../../../redux/store";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const menuItems = [
  {
    id: "pin",
    icon: (data) => {
      const user = store.getState().user;
      const { find } = getDiscussionData(user.id, "pins", data);
      return find ? PushPinIcon : PushPinOutlinedIcon;
    },
    type: "all",
    label: (data) => {
      const user = store.getState().user;
      const { find } = getDiscussionData(user.id, "pins", data);
      return find ? "Détacher" : "Epingler";
    },
    onAction(data, notifications) {
      const user = store.getState().user;
      const { pins, find } = getDiscussionData(user.id, "pins", data);

      if (find) {
        pins.splice(pins.indexOf(find), 1);
        notifications.show("Discussion dépinglée", {
          autoHideDuration: 3000,
          key: "unpined",
        });
      } else {
        if (pins.length > 2) {
          notifications.show("Vous ne pouvez épingler que 3 discussions", {
            autoHideDuration: 3000,
            key: "pin off",
          });
          return;
        }
        pins.push(data.id);
        notifications.show("Discussion épinglée", {
          autoHideDuration: 3000,
          key: "pined",
        });
      }
      store.dispatch({
        type: "app/updateApp",
        payload: {
          data: {
            user: { [user.id]: { discussions: { pins } } },
          },
        },
      });
    },
  },
  {
    id: "favorite",
    label: (data) => {
      const user = store.getState().user;
      const { find } = getDiscussionData(user.id, "favorites", data);
      return find ? "Retirer des favoris" : "Ajouter aux favoris";
    },
    type: "all",
    icon: (data) => {
      const user = store.getState().user;
      const { find } = getDiscussionData(user.id, "favorites", data);
      return find ? GradeIcon : GradeOutlinedIcon;
    },
    onAction(data, notifications) {
      const user = store.getState().user;
      const { favorites, find } = getDiscussionData(user.id, "favorites", data);
      if (find) {
        favorites.splice(favorites.indexOf(find), 1);
        notifications.show("Discussion retirée des favoris", {
          autoHideDuration: 3000,
          key: "unfavorite",
        });
      } else {
        favorites.push(data.id);
        notifications.show("Discussion ajoutée aux favoris", {
          autoHideDuration: 3000,
          key: "favorite",
        });
      }

      store.dispatch({
        type: "app/updateApp",
        payload: {
          data: {
            user: { [user.id]: { discussions: { favorites } } },
          },
        },
      });
    },
  },
  {
    id: "leave",
    label: "Quitter Lisanga",
    type: "room",
    icon: LogoutOutlinedIcon,
    disabled: true,
  },
  {
    id: "close",
    selected: true,
    type: "all",
    label: "Fermer la discussions",
    icon: CloseOutlinedIcon,

    onAction() {
      store.dispatch({
        type: "data/updateData",
        payload: { data: { discussionTarget: null, targetView: null } },
      });
    },
  },
];
export const getDiscussionData = (id, location, data) => {
  const discussionData = (store.getState().app.user[id]?.discussions || {})[
    location
  ];
  const newDiscussionData = [...(discussionData || [])];
  const find = newDiscussionData.find((id) => id == data?.id);
  return { [location]: newDiscussionData, find };
};
export const getFilteredMenuItems = ({ type, isSelected }) => {
  return menuItems.filter((item) => {
    let cond = true;
    if (item.type !== "all") cond = cond && item.type === type;
    if (item.selected) cond = cond && isSelected;
    return cond;
  });
};
export default menuItems;
