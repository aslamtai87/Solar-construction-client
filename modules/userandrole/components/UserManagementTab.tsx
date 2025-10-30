"use client";
import React from "react";
import { GenericTable } from "@/components/global/Table/GenericTable";
import { useTableState } from "@/hooks/useTableState";
import { useDialog } from "@/hooks/useDialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/global/StatusBadge";
import UserDialog from "./UserDialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}

// Static data for now
const staticUsers: User[] = [
  { id: "1", name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "active" },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "User",
    status: "suspended",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "User",
    status: "active",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Manager",
    status: "active",
  },
];

const UserManagementTab = () => {
  const {
    currentPage,
    setCurrentPage,
    searchText,
    debouncedSearchText,
    handleSearchChange,
  } = useTableState();

  const { dialog, openCreateDialog, openEditDialog, closeDialog } =
    useDialog<User>();

  // Filter users based on search
  const filteredUsers = staticUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
      user.role.toLowerCase().includes(debouncedSearchText.toLowerCase())
  );

  const handleDelete = (id: string) => {
    // TODO: Implement delete logic
  };

  const handleEdit = (user: User) => {
    openEditDialog(user);
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (user: User) => (
        <div className="p-4 font-medium text-black">{user.name}</div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user: User) => (
        <div className="p-4 text-gray-600">{user.email}</div>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "text-center",
      render: (user: User) => (
        <div className="p-4">
          <Badge variant="outline">{user.role}</Badge>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "text-center",
      render: (user: User) => (
        <div className="p-4">
          <StatusBadge status={user.status ? user.status.toLowerCase() as any : ""} />
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <div className="p-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(user)}
            className="border-gray-300 hover:bg-gray-100 hover:cursor-pointer"
          >
            <Pencil className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(user.id)}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-1" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <GenericTable
        data={filteredUsers}
        columns={columns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={1}
        nextPage={false}
        previousPage={false}
        searchValue={searchText}
        onSearchChange={handleSearchChange}
        onAdd={openCreateDialog}
        addButtonText="Add User"
        addButtonIcon={<Plus className="h-4 w-4 mr-1" />}
        searchPlaceholder="Search users..."
        tableName="User Management"
        tableDescription="Manage system users and their information"
        layout2={true}
        pagination={false}
      />
      <UserDialog
        open={dialog.open}
        onClose={closeDialog}
        mode={dialog.mode}
        userData={dialog.data}
      />
    </div>
  );
};

export default UserManagementTab;
