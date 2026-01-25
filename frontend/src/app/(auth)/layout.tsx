"use client";

import { PlayersProvider } from "@/hooks/use-players";
import { ClubsProvider } from "@/hooks/use-clubs";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlayersProvider>
      <ClubsProvider>
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
          {children}
        </main>
      </ClubsProvider>
    </PlayersProvider>
  );
}
