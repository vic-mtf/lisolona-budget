import { encrypt, decrypt } from "@/utils/crypt";
import store from "@/redux/store";
import { updateApp } from "@/redux/app";
import { updateUser } from "@/redux/user";
import { isPlainObject } from "lodash";
import { SIGN_IN_CHANNEL } from "@/utils/broadcastChannel";

export default function setSignInData(data: unknown) {
  const user = isPlainObject(data)
    ? {
        id: (data as Record<string, unknown>).userId,
        token: (data as Record<string, unknown>).token,
        email: (data as Record<string, unknown>).userEmail,
        firstName: (data as Record<string, unknown>).userFname,
        lastName: (data as Record<string, unknown>).userLname,
        middleName: (data as Record<string, unknown>).userMname || null,
        docTypes: (data as Record<string, unknown>).docTypes,
        number: (data as Record<string, unknown>).phoneCell,
        image: (data as Record<string, unknown>).userImage,
        grade: ((data as Record<string, unknown>)?.userGrade as Record<string, unknown>)?.grade,
        role: ((data as Record<string, unknown>)?.userGrade as Record<string, unknown>)?.role,
        auth: (data as Record<string, unknown>)?.auth,
      }
    : decrypt(data as string);

  const encryptUser = isPlainObject(data) ? encrypt(user) : (data as string);
  store.dispatch(updateApp({ data: { user: { data: encryptUser } } }));
  store.dispatch(
    updateUser({
      data: { ...(user as Record<string, unknown>), connected: true },
    })
  );
  SIGN_IN_CHANNEL.postMessage(encryptUser);
}
