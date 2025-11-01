"use client";
import React from "react";
import { GenericTable } from "@/components/global/Table/GenericTable";
import { useTableState } from "@/hooks/useTableState";
import { useDialog } from "@/hooks/useDialog";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/global/StatusBadge";
import UserDialog from "./UserDialog";
import DeleteDialog from "@/components/global/DeleteDialog";
import { useGetStaffs, useDeleteStaff } from "@/hooks/ReactQuery/useStaffs";
import { StaffUser } from "@/lib/types/user";


const UserManagementTab = () => {
  const { searchText, handleSearchChange } = useTableState();

  const {
    cursor,
    currentPageIndex,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    hasNextPage,
    hasPreviousPage,
  } = useCursorPagination();

  const { data: staffData, isLoading, refetch } = useGetStaffs(cursor, 10);
  const { mutate: deleteStaff } = useDeleteStaff();

  const { dialog, openCreateDialog, openEditDialog, closeDialog } = useDialog();
  const { dialog: deleteDialog, openEditDialog: openDeleteDialog, closeDialog: closeDeleteDialog } = useDialog();

  const handleDelete = (id: string) => {
    deleteStaff(id, {
      onSuccess: () => {
        closeDeleteDialog();
        refetch();
      }
    });
  };

  const handleEdit = (user: StaffUser) => {
    openEditDialog(user);
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (user: StaffUser) => (
        <div className="p-4 font-medium text-black">{user.fullName || `${user.firstName} ${user.lastName}`}</div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (user: StaffUser) => (
        <div className="p-4 text-gray-600">{user.email}</div>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "text-center",
      render: (user: StaffUser) => (
        <div className="p-4">
          <Badge variant="outline">
            {user.userRoles?.[0]?.role?.name || "No Role"}
          </Badge>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "text-center",
      render: (user: StaffUser) => (
        <div className="p-4">
          <StatusBadge status={user.status ? user.status.toLowerCase() as any : "inactive"} />
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: StaffUser) => (
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
            onClick={() => openDeleteDialog(user)}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-1" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <GenericTable
        data={staffData?.data?.result || []}
        columns={columns}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onAdd={openCreateDialog}
        addButtonText="Add User"
        addButtonIcon={<Plus className="h-4 w-4 mr-1" />}
        searchPlaceholder="Search users..."
        tableName="User Management"
        tableDescription="Manage system users and their information"
        layout2={true}
        pagination={true}
        paginationData={staffData?.data?.pagination}
        onNextPage={() => handleNextPage(staffData?.data?.pagination?.nextCursor || null)}
        onPreviousPage={handlePreviousPage}
        onFirstPage={handleFirstPage}
        hasNextPage={hasNextPage(staffData?.data?.pagination)}
        hasPreviousPage={hasPreviousPage}
        currentPageIndex={currentPageIndex}
        totalItems={staffData?.data?.pagination?.total || 0}
        currentItems={staffData?.data?.pagination?.noOfOutput || 0}
        isLoading={isLoading}
      />
      <UserDialog
        open={dialog.open}
        onClose={closeDialog}
        mode={dialog.mode}
        userData={dialog.data}
        onSuccess={refetch}
      />
      <DeleteDialog 
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={() => {
          if (deleteDialog.data?.id) {
            handleDelete(deleteDialog.data.id);
          }
        }}
        data={deleteDialog.data ?? null}
      />
    </div>
  );
};

export default UserManagementTab;
