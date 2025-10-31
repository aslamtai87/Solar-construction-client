"use client";
import React, { use, useEffect, useState } from "react";
import UserManagementTab from "./components/UserManagementTab";
import RoleManagementTab from "./components/RoleManagementTab";
import TabNavigation from "@/components/global/TabNavigation";
import { User, UserIcon } from "lucide-react";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (tabParam === "users" || tabParam === "roles") {
      setActiveTab(tabParam);
    }
  }, []);

  const onTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tabId);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return (
    <div className="w-full p-6 space-y-3">
      <div className="w-1/2">
        <TabNavigation
          tabs={[
            { id: "users", label: "User Management", icon: Users },
            { id: "roles", label: "Role Management", icon: UserIcon },
          ]}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
      {activeTab === "users" ? <UserManagementTab /> : <RoleManagementTab />}
    </div>
  );
};

export default UserManagement;
