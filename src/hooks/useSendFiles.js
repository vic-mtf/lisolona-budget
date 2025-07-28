import { useCallback } from "react";
// import store from "../redux/store";
import useLocalStoreData from "./useLocalStoreData";
import useToken from "./useToken";
import { axios } from "./useAxios";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const useSendFiles = () => {
  const [getData, setData] = useLocalStoreData();
  const discussionTarget = useSelector((store) => store.data.discussionTarget);
  const sender = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const Authorization = useToken();

  const onSendFiles = useCallback(
    ({ files = [] }) => {
      const messages = [];
      const to = discussionTarget?.id;
      const date = new Date();
      let key;
      let fileType = null;
      let subtype = null;
      let updatedAt = dayjs(date);

      files.reverse().forEach(({ type, ...file }) => {
        const formData = new FormData();
        updatedAt = updatedAt.add(1, "second");

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

        const message = {
          type: discussionTarget?.type,
          subtype,
          to,
          date: updatedAt.toDate(),
          createdAt: updatedAt.toJSON(),
          updatedAt: updatedAt.toJSON(),
          fileType,
          clientId: file.id,
          sender,
          status: "sending",
          file: fileData?.file,
          request: {
            loading: true,
            uploadProgress: 0,
            downloadProgress: 0,
            error: null,
          },
        };

        const localKeys = [
          "sender",
          "sending",
          "createdAt",
          "updatedAt",
          "request",
          "status",
        ];
        const remoteKeys = ["file", "date", "fileType", "to"];

        Object.keys(message).forEach((key) => {
          if (message[key] !== undefined && !localKeys.includes(key))
            formData.append(key, message[key]);
        });

        message.type = fileType;
        messages.subtype = subtype;

        const updateMessage = (data) => {
          dispatch({
            type: "data/updateMessage",
            payload: { data, id: file.id, targetId: to },
          });
        };

        const sendFile = async () => {
          let error;
          const controller = new AbortController();

          const abort = () => {
            updateMessage({ request: { loading: false } });
            controller.abort();
          };

          setData(key, { ...fileData, request: { abort, sendFile } });
          updateMessage({ request: { loading: true, status: "sending" } });

          try {
            await axios({
              signal: controller.signal,
              headers: { Authorization },
              method: "POST",
              url: "/api/chat/file",
              data: formData,
              onDownloadProgress({ total, loaded }) {
                const downloadProgress = loaded / total;
                updateMessage({ request: { downloadProgress, loading: true } });
              },
              onUploadProgress({ total, loaded }) {
                const uploadProgress = loaded / total;
                updateMessage({ request: { uploadProgress, loading: true } });
              },
            });
            error = null;
          } catch (err) {
            console.error(err);
            error = err?.toString();
          }

          updateMessage({
            status: error ? "sending" : "sended",
            request: { loading: false, error },
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
