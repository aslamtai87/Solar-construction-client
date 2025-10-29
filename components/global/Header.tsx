"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  Sun,
  ChevronDown,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { NewProjectDialog } from "./NewProjectDialog";

export const DashboardHeader = () => {
  const [notifications] = useState(3);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const handleNewProject = (data: any) => {
    console.log("New project created:", data);
    // TODO: Integrate with project management system
    // This would typically:
    // 1. Save project to database
    // 2. Update dashboard with new project
    // 3. Initialize modules with project data
    // 4. Show success toast
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects, documents, contacts..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3 ml-6">
            {/* New Project Button */}
            <Button 
              onClick={() => setIsNewProjectOpen(true)}
              className="flex items-center gap-2 bg-[#1a1d29] hover:bg-[#1a1d29]/90"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button>

            {/* Project Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-10">
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">Desert Bloom Phase 2</span>
                    <span className="text-xs text-gray-500">250MW</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem>
                    <div className="flex flex-col">
                      <span className="font-medium">Desert Bloom Phase 2</span>
                      <span className="text-sm text-gray-500">250MW • Arizona</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col">
                      <span className="font-medium">Riverside Solar Farm</span>
                      <span className="text-sm text-gray-500">180MW • California</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col">
                      <span className="font-medium">Mountain View Project</span>
                      <span className="text-sm text-gray-500">120MW • Nevada</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
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
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>
      </header>

      {/* <NewProjectDialog
        open={isNewProjectOpen}
        onOpenChange={setIsNewProjectOpen}
        onSubmit={handleNewProject}
      /> */}
    </>
  );
};


export default DashboardHeader;