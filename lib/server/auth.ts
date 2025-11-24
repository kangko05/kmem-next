"use server";

import { cookies } from "next/headers";
import { SERVER_BASE } from "../api";

export const fetchMe = async () => {
  const cookieStore = await cookies();
  const access = cookieStore.get("accessToken")?.value ?? "";
  const refresh = cookieStore.get("refreshToken")?.value ?? "";

  const cookieHeader = [
    access && `accessToken=${access}`,
    refresh && `refreshToken=${refresh}`,
  ]
    .filter(Boolean)
    .join("; ");

  return await fetch(`${SERVER_BASE}/auth/me`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });
};
