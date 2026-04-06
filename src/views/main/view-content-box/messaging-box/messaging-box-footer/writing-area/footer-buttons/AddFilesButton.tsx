import { ToggleButton } from "@mui/material";
import { useNotifications } from "@toolpad/core/useNotifications";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import getFile, {
  getType,
  getExtension,
  supportedAudioExtensions,
  supportedImageExtensions,
  supportedVideoExtensions,
  supportedDocumentExtensions,
  getName,
} from "@/utils/getFile";
import store from "@/redux/store";
import { updateData } from "@/redux/data/data";
import useLocalStoreData from "@/hooks/useLocalStoreData";
import getRandomId from "@/utils/getRandomId";

const AddFilesButton = ({ disabled }) => {
  const notifications = useNotifications();
  const [, setData] = useLocalStoreData();

  const handleGetFiles = async () => {
    const joined = (exts) => exts.map((ext) => `.${ext}`).join(",");
    const accept = joined([
      ...supportedAudioExtensions,
      ...supportedImageExtensions,
      ...supportedVideoExtensions,
      ...supportedDocumentExtensions,
    ]);
    const rawFiles = await getFile({ multiple: true, accept });
    const storeData = store.getState();
    const sender = storeData.user;
    const id = storeData.data.discussionTarget.id;
    const memoFiles = storeData.data.chatBox.footer.files[id] || [];
    let countExistFile = 0;

    const filteredFiles = rawFiles.filter((file) => {
      const found = memoFiles.find(
        ({ name, ext }) => `${name}.${ext}` === file.name
      );
      if (found) countExistFile++;
      return !found;
    });

    if (rawFiles.length + memoFiles.length > 10)
      notifications.show(texts.errors.filesLimit, {
        severity: "error",
        key: "files-limit",
        autoHideDuration: 3000,
      });

    const slicedFiles = filteredFiles.slice(0, 10 - memoFiles.length);

    const files = slicedFiles.map((file, i) => {
      const id = getRandomId(sender.id + i);
      const type = getType(file) === "application" ? "doc" : getType(file);
      const name = getName(file.name);
      const ext = getExtension(file.name);
      const src = window.URL.createObjectURL(file);

      const fileData = { id, type, src, name, ext };

      setData(`app.uploads.${type}s.${id}`, { ...fileData, file });

      return {
        id,
        name,
        type,
        ext,
        size: file.size,
        url: src.toString(),
      };
    });

    store.dispatch(
      updateData({
        data: {
          chatBox: {
            footer: {
              files: { [id]: [...files, ...memoFiles] },
            },
          },
        },
      })
    );
    if (countExistFile > 0) {
      notifications.show(
        countExistFile === 1 ? texts.errors.existFile : texts.errors.existFiles,
        {
          severity: "error",
          key: "exist-file",
          autoHideDuration: 3000,
        }
      );
    }
  };
  return (
    <>
      <ToggleButton
        size='small'
        color='primary'
        value='file'
        onClick={handleGetFiles}
        disabled={disabled}
        sx={{
          "&:hover": { "& > *": { transform: "rotate(0deg)" } },
        }}>
        <AttachFileOutlinedIcon
          fontSize='small'
          sx={{
            transition: "transform .2s",
            transform: "rotate(45deg)",
          }}
        />
      </ToggleButton>
    </>
  );
};

const texts = {
  errors: {
    filesLimit: "Vous ne pouvez pas télécharger plus de 10 fichiers",
    existFile: "Vous avez déjà ajouté ce fichier",
    existFiles: "Vous avez deja ajouté ces fichiers",
  },
};

export default AddFilesButton;
