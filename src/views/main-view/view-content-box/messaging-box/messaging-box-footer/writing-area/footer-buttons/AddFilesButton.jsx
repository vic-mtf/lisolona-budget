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
} from "../../../../../../../utils/getFile";
import store from "../../../../../../../redux/store";
import { updateData } from "../../../../../../../redux/data/data";
import PropTypes from "prop-types";

const AddFilesButton = ({ disabled }) => {
  const notifications = useNotifications();

  const handleGetFiles = async () => {
    const joined = (exts) => exts.map((ext) => `.${ext}`).join(",");
    const accept = joined([
      ...supportedAudioExtensions,
      ...supportedImageExtensions,
      ...supportedVideoExtensions,
      ...supportedDocumentExtensions,
    ]);
    const rawFiles = await getFile({ multiple: true, accept });
    const id = store.getState().data.discussionTarget.id;
    const memoFiles = store.getState().data.chatBox.footer.files[id] || [];
    let countExistFile = 0;

    const filteredFiles = rawFiles.filter((file) => {
      const found = memoFiles.find(
        ({ name, ext }) => `${name}.${ext}` === file.name
      );
      if (found) countExistFile++;
      return !found;
    });

    if (rawFiles.length + memoFiles.length > 10) {
      notifications.show(texts.errors.filesLimit, {
        severity: "error",
        key: "files-limit",
        autoHideDuration: 3000,
      });
      return;
    }

    const slicedFiles = filteredFiles.slice(0, 10 - memoFiles.length);
    const files = slicedFiles.map((file, index) => ({
      id: (Date.now() + index).toString(16).toLowerCase(),
      url: window.URL.createObjectURL(file).toString(),
      name: getName(file.name),
      type: getType(file) === "application" ? "doc" : getType(file),
      ext: getExtension(file.name),
      size: file.size,
    }));

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

AddFilesButton.propTypes = {
  disabled: PropTypes.bool,
};

const texts = {
  errors: {
    filesLimit: "Vous ne pouvez pas télécharger plus de 10 fichiers",
    existFile: "Vous avez déja ajouté ce fichier",
    existFiles: "Vous avez deja ajouté ces fichiers",
  },
};

export default AddFilesButton;
