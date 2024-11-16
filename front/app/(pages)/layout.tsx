"use client";

import "../styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, type Locale } from "@rainbow-me/rainbowkit";
import { config } from "../wagmi";
import Nav from "@/components/Nav";

const queryClient = new QueryClient();

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "en" as Locale;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale={locale}>
          <Nav />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
