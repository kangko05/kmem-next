"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apifetch } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
type UsageStats = {
  username: string;
  count: number;
  size: number;
  readableSize: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apifetch("/stats/usage");
        const json = (await res.json()) as { data: UsageStats };
        setStats(json.data);
      } catch (e) {
        console.error(e);
        setError("failed to load usage information");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="w-full flex justify-center px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="w-full flex justify-center px-4 py-10">
        <div className="max-w-md w-full text-center space-y-3">
          <p className="text-sm text-destructive">
            {error || "failed to load data"}
          </p>
          <Button size="sm" variant="outline" onClick={() => location.reload()}>
            Retry
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full md:h-[50dvh] flex md:items-center justify-center px-4 py-8">
      <section className="w-full max-w-6xl space-y-8">
        {/* 상단 카드 3개 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Signed in as
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold break-all">
                {stats.username}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">
                {stats.count}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Number of uploaded files
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Used storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stats.readableSize}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.size.toLocaleString()} bytes
              </p>
            </CardContent>
          </Card>
        </div>
        {/* 빠른 액션 */}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/upload">Upload files</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/files">View all files</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
