"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/global/Sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/global/Header";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen overflow-hidden">
        <SidebarProvider>
          <RoleBasedSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <DashboardHeader />
            <SidebarInset className="flex-1 overflow-auto">
              {children}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AuthGuard>
  );
}
