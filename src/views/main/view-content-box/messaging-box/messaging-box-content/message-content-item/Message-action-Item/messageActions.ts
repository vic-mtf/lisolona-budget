import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import store from "@/redux/store";
import { updateData } from "@/redux/data/data";

const messageActions = [
  {
    id: "reply",
    icon: ReplyOutlinedIcon,
    label: "Repondre au message",
    shortcut: true,
    action(data, messaging) {
      const [{ editorRef }] = messaging;
      const discussionId = store.getState().data.discussionTarget?.id;
      const key = `app.actions.messaging.reply.${discussionId}`;
      store.dispatch(updateData({ key, data }));
      if (!store.getState().data.chatBox.footer.recording)
        editorRef.current?.focus();
    },
    types: ["text", "media"],
    targets: ["remote"],
  },
  {
    id: "copy",
    icon: ContentCopyOutlinedIcon,
    label: "Copier",
    shortcut: true,
    types: ["text"],
    targets: ["remote", "local"],
    async action(data) {
      const { content } = data;
      try {
        const blob = new Blob([content], { type: "text/html" });
        const clipboardItem = new ClipboardItem({ "text/html": blob });
        await navigator.clipboard.write([clipboardItem]);
      } catch (error) {
        console.error(error.message);
      }
    },
  },
  {
    id: "dict",
    icon: CampaignOutlinedIcon,
    label: "Dicter le message",
    types: ["text"],
    targets: ["remote", "local"],
  },
  {
    id: "edit",
    icon: EditOutlinedIcon,
    label: "Modifier le message",
    disabled: true,
    shortcut: true,
    sender: "local",
    types: ["text"],
    targets: ["local"],
  },
  {
    id: "react",
    icon: AddReactionOutlinedIcon,
    label: "Reagir",
    shortcut: true,
    sender: "remote",
    types: ["text"],
    targets: ["remote"],
  },
  {
    id: "delete",
    icon: DeleteOutlineOutlinedIcon,
    label: "Supprimer le message",
    disabled: true,
    sender: "local",
    types: ["text"],
    targets: ["local"],
  },
];

export default messageActions;
