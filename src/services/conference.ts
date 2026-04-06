import type { AxiosRequestConfig } from "axios";

export const createConference = (
  body: Record<string, unknown>
): AxiosRequestConfig => ({
  url: "/api/conference/create",
  method: "POST",
  data: body,
});

export const joinConference = (code: string): AxiosRequestConfig => ({
  url: `/api/conference/join/${code}`,
  method: "GET",
});

export const getAgoraToken = (channelName: string): AxiosRequestConfig => ({
  url: `/api/conference/token/${channelName}`,
  method: "GET",
});
