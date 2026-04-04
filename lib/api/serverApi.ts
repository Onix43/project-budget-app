import { cookies } from "next/headers";
import { nextServer } from "./api";

export interface SessionResponse {
  headers: {
    "set-cookie"?: string[];
  };
  status: number;
}

export async function checkServerSession(): Promise<SessionResponse> {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
}
