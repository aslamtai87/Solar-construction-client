import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/global/Sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/global/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider>
        {/* Sidebar */}
        <RoleBasedSidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <DashboardHeader />
          
          {/* Page Content */}
          <SidebarInset className="flex-1 overflow-auto">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
