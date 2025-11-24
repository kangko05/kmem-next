import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { fetchMe } from "@/lib/server/auth";
import { AppNavigation } from "@/components/client/AppNavigation";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const res = await fetchMe();

  if (!res.ok) {
    redirect("/");
  }

  const resjson = await res.json();
  const username = resjson.data.username ?? "unknown user";

  return (
    <div className="w-full min-h-dvh flex flex-col">
      <AppNavigation username={username} />
      <div className="w-full h-full flex-1">{children}</div>
    </div>
  );
}
