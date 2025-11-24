"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: ReactNode }) {
  const queryclient = new QueryClient();

  return (
    <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
  );
}
