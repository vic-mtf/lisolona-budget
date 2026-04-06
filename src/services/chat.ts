import type { AxiosRequestConfig } from "axios";

export const getRoomCall = (code: string): AxiosRequestConfig => ({
  url: `/api/chat/room/call/${code}`,
  method: "GET",
});

export const sendMessage = (body: Record<string, unknown>): AxiosRequestConfig => ({
  url: "/api/chat/message",
  method: "POST",
  data: body,
});

export const getMessages = (targetId: string): AxiosRequestConfig => ({
  url: `/api/chat/messages/${targetId}`,
  method: "GET",
});

export const createDiscussion = (
  body: Record<string, unknown>
): AxiosRequestConfig => ({
  url: "/api/chat/discussion",
  method: "POST",
  data: body,
});
