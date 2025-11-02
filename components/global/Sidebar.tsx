"use client";
import Image from "next/image";
import {
  Calendar,
  Users,
  Sun,
  FolderKanban,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {  useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { SidebarItem } from "./SidebarItems";
import { useRouter } from "next/navigation";
// import { usePermissions } from "@/hooks/usePermissions";
// import PERMISSIONS from "@/lib/constants/permissions";
import House from "@/components/icons/House";
import { Button } from "@/components/ui/button";

interface SubMenuItem {
  title: string;
  url: string;
}

interface MenuItem {
  title: string;
  icon: any;
  url?: string;
  subItems?: SubMenuItem[];
  perms?: string[];
  anyPerms?: string[];
  role?: string;
}

const menuItems: Record<string, MenuItem[]> = {
  items: [
    { title: "Dashboard", icon: House, url: "/dashboard" },
    { title: "Projects", icon: FolderKanban, url: "/projects" },
    {
      title: "User Management",
      icon: Users,
      url: "/user-management",
    },
    { 
      title: "Schedule Management", 
      icon: Calendar, 
      subItems: [
        { title: "Overview", url: "/schedule-management/overview" },
        { title: "Management", url: "/schedule-management/management" },
      ]
    },
  ],
};

export const RoleBasedSidebar = () => {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  
  const isItemActive = (url?: string) => {
    if (!url) return false;
    return pathname === url || pathname.startsWith(url + "/");
  };

  const isSubItemActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/");
  };
  
  const getRoleDisplayName = (role: string) => {
    return role
      ? `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`
      : "Dashboard";
  };

  useEffect(() => {
    close();
  }, [pathname, close]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1080) {
        close();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [close]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const SidebarComponent = (
    <Sidebar className="border-r h-full ">
      {/* Logo Section */}
      <SidebarHeader className="border-b px-4 py-[26.5px]">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 rounded-lg p-1.5">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-foreground leading-tight">
              SunTrakker
            </h1>
            <p className="text-xs text-muted-foreground leading-tight">
              Enterprise Solar Management
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-3">
        <SidebarMenu className="space-y-3.5">
          {menuItems.items.map((item, index) => (
            <SidebarItem
              key={index}
              title={item.title}
              icon={item.icon}
              url={item.url}
              isActive={isItemActive(item.url)}
              subItems={item.subItems}
              isSubItemActive={isSubItemActive}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );

  // Mobile-only sidebar content (without Sidebar wrapper)
  const MobileSidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Logo Section for Mobile */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 rounded-lg p-1.5">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-foreground leading-tight">
              SunTrakker
            </h1>
            <p className="text-xs text-muted-foreground leading-tight">
              Enterprise Solar Management
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-3.5 list-none">
          {menuItems.items.map((item, index) => (
            <SidebarItem
              key={index}
              title={item.title}
              icon={item.icon}
              url={item.url}
              isActive={isItemActive(item.url)}
              subItems={item.subItems}
              isSubItemActive={isSubItemActive}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">{SidebarComponent}</div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Backdrop */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-9998" onClick={close} />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-64 z-9999 transform transition-transform duration-300 ease-in-out shadow-lg ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {MobileSidebarContent}
        </div>
      </div>
    </>
  );
};
