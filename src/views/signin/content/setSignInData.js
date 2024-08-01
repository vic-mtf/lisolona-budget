import { encrypt } from "../../../utils/crypt";
import getAppsPermissions from "../../../utils/getAppsPermissions";
import { SIGN_IN_CHANNEL } from "../../../utils/broadcastChannel";
import store from "../../../redux/store";
import { setUser } from "../../../redux/app";

export default function setSignInData(data) {
  const user = {
    id: data.userId,
    token: data.token,
    email: data.userEmail,
    firstName: data.userFname,
    lastName: data.userLname,
    middleName: data.userMname || null,
    docTypes: data.docTypes,
    number: data.phoneCell,
    image: data.userImage || null,
    grade: data?.userGrade?.grade,
    role: data?.userGrade?.role,
    permissions: getAppsPermissions(data?.auth),
  };
  const encryptUser = encrypt(user);
  SIGN_IN_CHANNEL.postMessage(encryptUser, window.location.origin);
  store.dispatch(setUser(encryptUser));
  window.close();
}
