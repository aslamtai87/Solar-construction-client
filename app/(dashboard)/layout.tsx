'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/global/Sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/global/Header";
import { useGetUserProfile } from "@/hooks/ReactQuery/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/global/LoadingState";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userProfile } = useGetUserProfile();
  const router = useRouter();
  useEffect(() => {
    if (!userProfile) {
      router.push('/signin');
    }
  }, [userProfile]);

  if (!userProfile) {
    return <LoadingState />;
  }
  return (
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
  );
}
