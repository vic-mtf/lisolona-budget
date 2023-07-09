import store from "../redux/store";
import { decrypt } from "./crypt";
import openNewWindow from "./openNewWindow";

export default function openSignin () {
    const localUser = store.getState().app.user;
    const userSave = localUser && decrypt(localUser);
    openNewWindow({
        url: `/account/signin?usersession=${!userSave}`,
    }).name = 'signin';
}