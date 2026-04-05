import CryptoJS from "crypto-js";

const _KEY_WORD = "2ABCDEFGH14544n@XHWGDHGDQRS@@UVWXYZabcdefgh?cvghgcff!$$hgh";

export const encrypt = (obj: unknown): string | null => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(obj), _KEY_WORD).toString();
  } catch {
    return null;
  }
};

export const decrypt = (cipher: string): unknown | null => {
  try {
    return JSON.parse(
      CryptoJS.AES.decrypt(cipher, _KEY_WORD).toString(CryptoJS.enc.Utf8)
    );
  } catch {
    return null;
  }
};

const crypt = { encrypt, decrypt };
export default crypt;
