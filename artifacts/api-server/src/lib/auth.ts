import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "nexa-dev-secret-2025-change-in-production";
const JWT_EXPIRES_IN = "30d";

const ENC_KEY_HEX = (process.env.WALLET_ENCRYPTION_KEY || "a".repeat(64)).slice(0, 64);
const ENCRYPTION_KEY = Buffer.from(ENC_KEY_HEX, "hex");

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { sub: number } {
  return jwt.verify(token, JWT_SECRET) as { sub: number };
}

export function encryptPrivateKey(privateKey: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(privateKey, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("hex");
}

export function decryptPrivateKey(encryptedHex: string): string {
  try {
    const buf = Buffer.from(encryptedHex, "hex");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const encrypted = buf.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return "";
  }
}
