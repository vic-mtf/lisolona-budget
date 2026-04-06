import axios from "axios";
import store from "@/redux/store";
import { updateUser } from "@/redux/user";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const axiosApiInstance = axios.create({
  baseURL: BASE_URL,
  responseType: "json",
  responseEncoding: "utf8",
  maxContentLength: Number(import.meta.env.VITE_MAX_CONTENT_LENGTH),
});

axiosApiInstance.interceptors.request.use((config) => {
  const token = store.getState().user.token;
  const connected = store.getState().user.connected;
  if (token && connected)
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(
        updateUser({ data: { connected: false, token: null } })
      );
      document
        .getElementById("root")
        ?.dispatchEvent(new CustomEvent("_session_expired"));
    }
    return Promise.reject(error);
  }
);
