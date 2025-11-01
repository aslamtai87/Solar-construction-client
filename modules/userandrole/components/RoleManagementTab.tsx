'use client';
import { GenericTable } from '@/components/global/Table/GenericTable';
import { useTableState } from '@/hooks/useTableState';
import { useDialog } from '@/hooks/useDialog';
import { useCursorPagination } from '@/hooks/useCursorPagination';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DeleteDialog from '@/components/global/DeleteDialog';
import { useGetRoles, useDeleteRole } from '@/hooks/ReactQuery/useAuth';
import { Roles } from '@/lib/types/auth';


const RoleManagementTab = () => {
  const { searchText, handleSearchChange } = useTableState();
  const deleteRole = useDeleteRole();
  
  const {
    cursor,
    currentPageIndex,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    hasNextPage,
    hasPreviousPage,
  } = useCursorPagination();

  const { data: rolesData, isLoading, refetch } = useGetRoles(cursor, 10);
  
  const handleDelete = (id: string) => {
    deleteRole.mutate(id, {
      onSuccess: () => {
        closeDeleteDialog();
        refetch();
      }
    });
  };

  const { dialog: deleteDialog, openEditDialog: openDeleteDialog, closeDialog: closeDeleteDialog } = useDialog();

  const columns = [
    {
      key: 'name',
      header: 'Role Name',
      render: (role: Roles) => (
        <div className="p-4 font-medium text-black">{role.name}</div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (role: Roles) => (
        <div className="p-4 text-gray-600">{role.description}</div>
      ),
    },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (role: Roles) => (
        <div className="p-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-600">
            {role.rolePermission?.length || 0} permissions
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (role: Roles) => (
        <div className="p-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="border-gray-300 hover:bg-gray-100"
            onClick={() => window.location.href = `/user-management/role/edit/${role.id}`}
          >
            <Pencil className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteDialog(role)}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
          </Button>
        </div>
      ),
    },
  ];

  const handleAddRole = () => {
    window.location.href = '/user-management/role/create';
  };

  return (
    <div className="space-y-4">
            <GenericTable
        data={rolesData?.data?.result || []}
        columns={columns}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by role name or description..."
        isLoading={isLoading}
        paginationData={rolesData?.data?.pagination}
        onNextPage={() => handleNextPage(rolesData?.data?.pagination?.nextCursor || null)}
        onPreviousPage={handlePreviousPage}
        onFirstPage={handleFirstPage}
        hasNextPage={hasNextPage(rolesData?.data?.pagination)}
        hasPreviousPage={hasPreviousPage}
        currentPageIndex={currentPageIndex}
        totalItems={rolesData?.data?.pagination?.total || 0}
        currentItems={rolesData?.data?.pagination?.noOfOutput || 0}
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

export default RoleManagementTab;
