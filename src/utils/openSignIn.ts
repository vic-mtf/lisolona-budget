import openNewWindow from "./openNewWindow";
export default function openSignIn() {
  openNewWindow({
    url: `/account/login`,
  }).name = "GEID - Connexion";
}
