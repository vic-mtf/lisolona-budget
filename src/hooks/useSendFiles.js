import { useCallback } from "react";
// import store from "../redux/store";
import useLocalStoreData from "./useLocalStoreData";
import useToken from "./useToken";
import { axios } from "./useAxios";
import { useDispatch, useSelector } from "react-redux";

const useSendFiles = () => {
  const [getData, setData] = useLocalStoreData();
  const discussionTarget = useSelector((store) => store.data.discussionTarget);
  const sender = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const Authorization = useToken();

  const onSendFiles = useCallback(
    (files = []) => {
      const messages = [];
      const date = new Date();
      const to = discussionTarget?.id;
      let key;
      let fileType = null;
      let subtype = null;

      files.forEach(({ type, ...file }) => {
        const formData = new FormData();
        date.setMilliseconds(date.getMilliseconds() + 200);

        /////////////////////////////////
        if (type === "voice") {
          key = `app.uploads.voices.${file?.id}`;
          fileType = "voice";
          subtype = "audio";
        } else {
          key = `app.uploads.${type}s.${file?.id}`;
          if (["video", "image", "audio"].includes(type)) fileType = "media";
          subtype = type !== "doc" && type;
          fileType ??= type;
        }
        /////////////////////////////////

        const fileData = getData(key);

        let error;

        const message = {
          type: discussionTarget?.type,
          subtype,
          to,
          date,
          createdAt: date.toJSON(),
          fileType,
          clientId: file.id,
          sender,
          sending: true,
          file: fileData?.file,
        };

        const localKeys = ["sender", "sending", "createdAt"];
        const remoteKeys = ["file", "date", "fileType", "to"];

        Object.keys(message).forEach((key) => {
          if (message[key] !== undefined && !localKeys.includes(key))
            formData.append(key, message[key]);
        });

        message.type = fileType;
        messages.subtype = subtype;

        const sendFile = async () => {
          const controller = new AbortController();

          setData(key, {
            ...fileData,
            request: {
              loading: true,
              sendFile,
              cancel() {
                controller.abort();
              },
            },
          });

          try {
            await axios({
              signal: controller.signal,
              headers: { Authorization },
              method: "POST",
              url: "/api/chat/file",
              data: formData,
              onDownloadProgress(e) {
                const onDownloadProgress =
                  getData(key).request?.onDownloadProgress;
                if (typeof onDownloadProgress === "function")
                  onDownloadProgress(e);
              },
              onUploadProgress(e) {
                const onUploadProgress = getData(key).request?.onUploadProgress;
                if (typeof onUploadProgress === "function") onUploadProgress(e);
              },
            });
            error = null;
          } catch (err) {
            console.error(err);
            error = err;
          }

          const data = getData(key);
          const onLoaded = data?.request?.onLoaded;

          if (typeof onLoaded === "function") onLoaded(!error);

          setData(key, {
            ...data,
            request: error ? { ...data?.request, error, loading: false } : null,
          });
        };

        sendFile();
        remoteKeys.forEach((key) => delete message[key]);
        messages.push(message);
      });
      dispatch({
        type: "data/updateData",
        payload: {
          data: {
            chatBox: {
              footer: {
                recording: false,
                files: { [discussionTarget?.id]: [] },
              },
            },
          },
        },
      });
      return messages;
    },
    [getData, setData, Authorization, discussionTarget, dispatch, sender]
  );
  return onSendFiles;
};
export default useSendFiles;
