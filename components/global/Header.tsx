"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  User,
  ChevronDown,
  Plus,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/hooks/useSidebar";
import { useLogout } from "@/hooks/ReactQuery/useAuth";
import {toast} from "sonner"
import { useRouter } from "next/navigation";
import CreateProject from "@/modules/project/components/CreateProject";
import { useDialog } from "@/hooks/useDialog";

export const DashboardHeader = () => {
  const [notifications] = useState(3);
  const { toggle } = useSidebar();
  const logout = useLogout();
  const handleLogout = () => {
    try {
      logout.mutate();
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const {dialog:projectDialog, openCreateDialog: openProjectDialog, closeDialog: closeProjectDialog} = useDialog();
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Search Bar */}
            <div className="md:flex-1 gap-2 flex w-full md:max-w-2xl">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search projects, documents, contacts..."
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3 md:ml-6 justify-between">
              {/* New Project Button */}
              <Button
                onClick={openProjectDialog}
                className="flex items-center gap-2 bg-[#1a1d29] hover:bg-[#1a1d29]/90"
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>

              {/* Project Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-10"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-sm">
                        Desert Bloom Phase 2
                      </span>
                      <span className="text-xs text-gray-500">250MW</span>
                    </div>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem>
                    <div className="flex flex-col">
                      <span className="font-medium">Desert Bloom Phase 2</span>
                      <span className="text-sm text-gray-500">
                        250MW • Arizona
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col">
                      <span className="font-medium">Riverside Solar Farm</span>
                      <span className="text-sm text-gray-500">
                        180MW • California
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col">
                      <span className="font-medium">Mountain View Project</span>
                      <span className="text-sm text-gray-500">
                        120MW • Nevada
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Help & Support</DropdownMenuItem>
                  <DropdownMenuItem className="hover:cursor-pointer" onClick={()=>{
                    handleLogout();
                  }}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* <NewProjectDialog
        open={isNewProjectOpen}
        onOpenChange={setIsNewProjectOpen}
        onSubmit={handleNewProject}
      /> */}
      <CreateProject
        open={projectDialog.open}
        onClose={closeProjectDialog}
      />
    </>
  );
};

export default DashboardHeader;
