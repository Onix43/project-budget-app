"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface TanStackProviderProps {
  children: React.ReactNode;
}

export default function TanStackProvider({ children }: TanStackProviderProps) {
  const [provider] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={provider}>{children}</QueryClientProvider>
  );
}
