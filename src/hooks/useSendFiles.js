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
      files.forEach((file) => {
        const formData = new FormData();
        date.setSeconds(date.getSeconds() + 1);
        switch (file.type) {
          case "voice": {
            const key = `app.uploads.voices.${file?.id}`;
            const voice = getData(key);
            let error;

            const message = {
              type: discussionTarget?.type,
              subtype: "audio",
              to,
              date,
              createdAt: date.toJSON(),
              fileType: file.type,
              clientId: file.id,
              file: voice?.file,
              sender,
              sending: true,
            };
            const localKeys = ["sender", "sending", "createdAt"];

            Object.keys(message).forEach((key) => {
              if (message[key] !== undefined && !localKeys.includes(key))
                formData.append(key, message[key]);
            });

            message.type = "voice";
            messages.subtype = "AUDIO";

            const sendVoice = async () => {
              const controller = new AbortController();
              setData(key, {
                ...voice,
                request: {
                  loading: true,
                  sendVoice,
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
                    const onUploadProgress =
                      getData(key).request?.onUploadProgress;
                    if (typeof onUploadProgress === "function")
                      onUploadProgress(e);
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
                request: error
                  ? { ...data?.request, error, loading: false }
                  : null,
              });
            };
            sendVoice();
            messages.push(message);
            delete message?.file;
            delete message?.date;
            delete message?.fileType;
            delete message?.to;
            break;
          }
          default:
            console.log("default");
        }
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
      // dispatch({
      //   type: "data/updateArraysData",
      //   payload: {
      //     data: { discussions: [{ updatedAt, messages, id: to }] },
      //     user: sender,
      //   },
      // });
    },
    [getData, setData, Authorization, discussionTarget, dispatch, sender]
  );
  return onSendFiles;
};
export default useSendFiles;

// type: direct
// subtype
// audio
// to : 654ca53526899bfaf496d5b0
// date :  Wed Jul 23 2025 17:17:43 GMT 0200 (heure d’été d’Europe centrale)
// fileType : voice
// clientId :19837dca207
// file
