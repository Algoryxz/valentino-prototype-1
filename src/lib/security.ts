import crypto from "crypto";
import { customAlphabet } from "nanoid";
export { graphemeMax } from "./sanitize";

// 128+ bit cryptographic random publicId (22 chars with alphabet of 64 chars = 64^22 = 2^132)
const nanoid128 = customAlphabet(
  "useandom-26T198340PX75pxJACKVERYMINDBUSQUITFlProcessheldhomsg_k",
  22
);

export function generatePublicId(): string {
  return nanoid128();
}

export function generateEditCredential(): string {
  return crypto.randomBytes(32).toString("hex"); // 256 bits of cryptographically secure entropy
}

export function getPepper(): string {
  const pepper = process.env.EDIT_SECRET_PEPPER;
  if (!pepper) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("EDIT_SECRET_PEPPER must be configured in production");
    }
    return "dev-fallback-pepper-at-least-32-chars-long";
  }
  return pepper;
}

export function hashEditCredential(credential: string): string {
  const pepper = getPepper();
  return crypto.createHmac("sha256", pepper).update(credential).digest("hex");
}

export function verifyEditCredential(credential: string, storedHash: string): boolean {
  try {
    const computedHash = hashEditCredential(credential);
    const computedBuf = Buffer.from(computedHash, "hex");
    const storedBuf = Buffer.from(storedHash, "hex");
    if (computedBuf.length !== storedBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedBuf, storedBuf);
  } catch {
    return false;
  }
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
}

export function encryptSecretPayload(plaintext: string): EncryptedPayload {
  const pepper = getPepper();
  const key = crypto.createHash("sha256").update(pepper).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return { ciphertext, iv: iv.toString("hex"), tag };
}

export function decryptSecretPayload(payload: EncryptedPayload): string {
  const pepper = getPepper();
  const key = crypto.createHash("sha256").update(pepper).digest();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(payload.iv, "hex"));
  decipher.setAuthTag(Buffer.from(payload.tag, "hex"));
  let plaintext = decipher.update(payload.ciphertext, "hex", "utf8");
  plaintext += decipher.final("utf8");
  return plaintext;
}

export function hashReporterId(identifier: string): string {
  const pepper = getPepper();
  return crypto.createHmac("sha256", pepper).update(identifier).digest("hex");
}
