import openNewWindow from "./openNewWindow";

export default function openSignIn() {
  const base = new URL(import.meta.env.BASE_URL, window.location.origin);
  const url = import.meta.env.DEV
    ? new URL("account/signin/", base).href
    : new URL("/account/login", window.location.origin).href;
  openNewWindow({ url }).name = "GEID - Connexion";
}
