"use client";

import { FormEvent, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export function LoginCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const username = (form.username as any).value;
    const password = (form.password as any).value;

    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Invalid username or password");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <Card className="w-full max-w-sm bg-background border-none md:bg-card md:outline">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="enter your username"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            <Button
              type="submit"
              className="w-full md:cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="h-4 text-red-400 text-sm text-center whitespace-pre-wrap">
        {error || ""}
      </p>
    </div>
  );
}
