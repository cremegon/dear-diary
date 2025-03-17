import { config } from "../config";
import CryptoJS from "crypto-js";
const CRYPTO_SECRET = config.cryptoSecret;

export const encryptUserId = (userId: number): string => {
  const encrypted = CryptoJS.AES.encrypt(
    userId.toString(),
    CRYPTO_SECRET
  ).toString();
  return CryptoJS.SHA256(encrypted).toString(CryptoJS.enc.Hex).slice(0, 8);
};

export const decryptUserId = (encryption: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryption, CRYPTO_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
