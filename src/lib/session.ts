import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionData {
  id?: number;
}

const sessionOptions = {
  cookieName: "delicious-karrot",
  password: process.env.COOKIE_PASSWORD!,
};

export default async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session;
}
