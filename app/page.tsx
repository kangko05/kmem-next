import { redirect } from "next/navigation";
import { LoginCard } from "@/components/client/LoginCard";
import { fetchMe } from "@/lib/server/auth";

export default async function Home() {
  try {
    const res = await fetchMe();

    if (res.ok) {
      redirect("/dashboard");
    }

    return (
      <div className="w-full min-h-dvh flex items-center justify-center">
        <LoginCard />
      </div>
    );
  } catch (err) {
    return (
      <main className="w-full min-h-dvh flex items-center justify-center px-4">
        <section className="w-full max-w-md rounded-xl border bg-card shadow-sm px-6 py-8 space-y-4 text-center">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Failed to connect</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unable to reach the server right now.
              <br />
              Please try again in a moment.
            </p>
          </div>
        </section>
      </main>
    );
  }
}
