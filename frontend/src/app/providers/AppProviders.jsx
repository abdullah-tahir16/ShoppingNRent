import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import { SessionProvider } from "./SessionProvider";

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
}
