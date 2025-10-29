"use client";
import React, { useState } from "react";
import UserManagementTab from "./components/UserManagementTab";
import RoleManagementTab from "./components/RoleManagementTab";
import TabNavigation from "@/components/global/TabNavigation";
import { User, UserIcon } from "lucide-react";
import { Users } from "lucide-react";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="w-full p-6 space-y-3">
      <div className="w-full">
        <TabNavigation
          tabs={[
            { id: "users", label: "User Management", icon: Users },
            { id: "roles", label: "Role Management", icon: UserIcon },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      {activeTab === "users" ? <UserManagementTab /> : <RoleManagementTab />}
    </div>
  );
};

export default UserManagement;
