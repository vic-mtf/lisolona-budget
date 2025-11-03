import store from '../../../../redux/store';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import GradeIcon from '@mui/icons-material/Grade';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { getDiscussionData } from '../discussions/discussionMenuItems';
import { startNewCall } from '../../../../utils/handleStartNewCall';

const menuItems = [
  {
    id: 'write',
    icon: ChatBubbleOutlineOutlinedIcon,

    label: 'Écrire un message',
    onAction(contact) {
      store.dispatch({
        type: 'data/updateData',
        payload: {
          key: ['discussionTarget', 'targetView'],
          data: [
            {
              ...contact,
              type: 'direct',
              members: [contact, store.getState().user],
              ...store
                .getState()
                .data.app.discussions.find((d) => d?.id === contact?.id),
            },
            'messages',
          ],
        },
      });
    },
  },
  {
    id: 'call',
    label: 'Appeler',

    icon: LocalPhoneOutlinedIcon,
    onAction(data) {
      startNewCall(data);
    },
  },
  {
    id: 'favorite',
    label: (data) => {
      const user = store.getState().user;
      const { find } = getDiscussionData(user.id, 'favorites', data);
      return find ? 'Supprimer des favoris' : 'Ajouter aux favoris';
    },

    icon: (data) => {
      const user = store.getState().user;
      const { find } = getDiscussionData(user.id, 'favorites', data);
      return find ? GradeIcon : GradeOutlinedIcon;
    },
    onAction(data, notifications) {
      const user = store.getState().user;
      const { favorites, find } = getDiscussionData(user.id, 'favorites', data);
      if (find) {
        favorites.splice(favorites.indexOf(find), 1);
        notifications.show('Contact supprimé des favoris', {
          key: 'unfavorite',
          autoHideDuration: 3000,
        });
      } else {
        favorites.push(data.id);
        notifications.show('Contact ajouté aux favoris', {
          key: 'favorite',
          autoHideDuration: 3000,
        });
      }
      store.dispatch({
        type: 'app/updateApp',
        payload: {
          data: {
            user: { [user.id]: { discussions: { favorites } } },
          },
        },
      });
    },
  },
  // {
  //   id: "share",
  //   label: "Partager",
  //   icon: ShareOutlinedIcon,
  //
  //   onAction(data) {},
  // },
  {
    id: 'delete',
    label: 'Retirer de vos contact',
    icon: RemoveCircleOutlineIcon,
    disabled: false,
    onAction(user) {
      store.dispatch({
        type: 'data/updateData',
        payload: {
          key: 'app.actions.contacts.confirmDelete',
          data: { user, id: user.id, open: true },
        },
      });
    },
  },
];

export default menuItems;
