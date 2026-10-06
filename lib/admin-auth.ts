import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "teckdrop-admin";
const SESSION_MESSAGE = "teckdrop-admin-session";

function getSecret() {
  return process.env.ADMIN_PASSWORD || "";
}

function expectedToken() {
  const secret = getSecret();
  return secret ? createHmac("sha256", secret).update(SESSION_MESSAGE).digest("hex") : "";
}

export function isAdminConfigured() {
  return Boolean(getSecret());
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const expected = expectedToken();
  if (!token || !expected || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function setAdminSession() {
  const token = expectedToken();
  if (!token) return false;
  (await cookies()).set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return true;
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}
