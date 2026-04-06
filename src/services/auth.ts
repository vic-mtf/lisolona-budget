import type { AxiosRequestConfig } from "axios";

export const loginService: AxiosRequestConfig = {
  method: "POST",
  url: "/api/auth/login",
};

export const checkAccountService: AxiosRequestConfig = {
  method: "POST",
  url: "/api/auth/check",
};

export const checkEmail = (email: string): AxiosRequestConfig => ({
  method: "POST",
  url: "/api/auth/check",
  data: { type: "email", email },
});

export const checkToken = (token: string): AxiosRequestConfig => ({
  method: "POST",
  url: "/api/auth/check",
  data: { type: "token", token },
});

export const initSession = (token: string): AxiosRequestConfig => ({
  url: "/api/auth/init",
  method: "GET",
  headers: { Authorization: `Bearer ${token}` },
});
