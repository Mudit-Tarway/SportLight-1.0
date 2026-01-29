"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { MainSidebar } from "@/components/layout/main-sidebar";
import Chatbot from "@/components/chatbot/chatbot";
import { PlayersProvider } from "@/hooks/use-players";
import { ClubsProvider } from "@/hooks/use-clubs";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <PlayersProvider>
        <ClubsProvider>
          <SidebarProvider>
            <MainSidebar />
            <SidebarRail />
            <SidebarInset>
              <Header />
              <main className="flex-1 p-4 md:p-6 lg:p-8">
                  {children}
              </main>
              <Chatbot />
            </SidebarInset>
          </SidebarProvider>
        </ClubsProvider>
      </PlayersProvider>
  );
}
