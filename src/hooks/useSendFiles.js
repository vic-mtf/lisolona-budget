import { useCallback } from "react";
import store from "../redux/store";
import useLocalStoreData from "./useLocalStoreData";
import useToken from "./useToken";
import { axios } from "./useAxios";

const useSendFiles = () => {
  const [getData, setData] = useLocalStoreData();
  const Authorization = useToken();

  const onSendFiles = useCallback(
    (files = []) => {
      const discussionTarget = store.getState().data.discussionTarget;

      const messages = [];

      files.forEach((file) => {
        const formData = new FormData();
        switch (file.type) {
          case "voice": {
            const key = `app.uploads.voices.${file?.id}`;
            const voice = getData(key);

            const message = {
              type: discussionTarget?.type,
              subtype: "audio",
              to: discussionTarget.id,
              date: new Date().toJSON(),
              fileType: file.type,
              clientId: file.id,
              file: voice?.file,
              sender: store.getState().user,
            };

            Object.keys(message).forEach((key) => {
              if (message[key] !== undefined)
                formData.append(key, message[key]);
            });
            const sendVoice = () => {
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

              axios({
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
              })
                .then(() => {
                  const data = getData(key);
                  const onLoaded = getData(key)?.request?.onLoaded;
                  if (typeof onLoaded === "function") onLoaded(true);

                  setData(key, {
                    ...data,
                    request: null,
                  });
                })
                .catch((error) => {
                  const data = getData(key);
                  const onLoaded = data?.request?.onLoaded;
                  if (typeof onLoaded === "function") onLoaded(true);
                  console.error(error);
                  setData(key, {
                    ...data,
                    request: { error, loading: false, ...data?.request },
                  });
                });
              if (message?.file) delete message?.file;
              messages.push(message);
            };
            sendVoice();
            break;
          }
          default:
            console.log("default");
        }
      });
      store.dispatch({
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
    [getData, setData, Authorization]
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
