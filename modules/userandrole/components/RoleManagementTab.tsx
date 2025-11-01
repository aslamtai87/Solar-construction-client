'use client';
import { GenericTable } from '@/components/global/Table/GenericTable';
import { useTableState } from '@/hooks/useTableState';
import { useDialog } from '@/hooks/useDialog';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DeleteDialog from '@/components/global/DeleteDialog';
import { useGetRoles } from '@/hooks/ReactQuery/useAuth';
import { Roles } from '@/lib/types/auth';


const RoleManagementTab = () => {
  const {
    currentPage,
    setCurrentPage,
    searchText,
    debouncedSearchText,
    handleSearchChange,
  } = useTableState();

  const { data: rolesData } = useGetRoles();
  const handleDelete = (id: string) => {
    closeDeleteDialog();
  };

  const { dialog:deleteDialog, openEditDialog:openDeleteDialog, closeDialog:closeDeleteDialog } = useDialog();

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
    <div>
      <GenericTable
        data={
          rolesData?.data?.result || []
        }
        columns={columns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={1}
        nextPage={false}
        previousPage={false}
        searchValue={searchText}
        onSearchChange={handleSearchChange}
        onAdd={handleAddRole}
        addButtonText="Add Role"
        addButtonIcon={<Plus className="h-4 w-4 mr-1" />}
        searchPlaceholder="Search roles..."
        tableName="Role Management"
        tableDescription="Manage system roles and permissions"
        layout2={true}
        pagination={false}
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
