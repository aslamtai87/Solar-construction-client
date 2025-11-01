'use client';
import { GenericTable } from '@/components/global/Table/GenericTable';
import { useTableState } from '@/hooks/useTableState';
import { useDialog } from '@/hooks/useDialog';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import DeleteDialog from '@/components/global/DeleteDialog';
import { useGetRoles } from '@/hooks/ReactQuery/useAuth';
import { Roles } from '@/lib/types/auth';
import { useState } from 'react';


const RoleManagementTab = () => {
  const {
    searchText,
    handleSearchChange,
  } = useTableState();

  const [cursor, setCursor] = useState<string | null>(null);
  const [pageHistory, setPageHistory] = useState<(string | null)[]>([null]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const itemsPerPage = 10;

  const { data: rolesData, isLoading } = useGetRoles(cursor, itemsPerPage);
  
  const handleDelete = (id: string) => {
    closeDeleteDialog();
  };

  const { dialog:deleteDialog, openEditDialog:openDeleteDialog, closeDialog:closeDeleteDialog } = useDialog();

  const handleNextPage = () => {
    if (rolesData?.data?.pagination?.nextCursor) {
      const nextCursor = rolesData.data.pagination.nextCursor;
      setCursor(nextCursor);
      
      // Add to history if not already there
      if (pageHistory[currentPageIndex + 1] !== nextCursor) {
        const newHistory = [...pageHistory.slice(0, currentPageIndex + 1), nextCursor];
        setPageHistory(newHistory);
      }
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      const prevCursor = pageHistory[currentPageIndex - 1];
      setCursor(prevCursor);
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleFirstPage = () => {
    setCursor(null);
    setCurrentPageIndex(0);
    setPageHistory([null]);
  };

  const hasNextPage = !!rolesData?.data?.pagination?.nextCursor;
  const hasPreviousPage = currentPageIndex > 0;
  const totalItems = rolesData?.data?.pagination?.total || 0;
  const currentItems = rolesData?.data?.pagination?.noOfOutput || 0;

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
        searchValue={searchText}
        onSearchChange={handleSearchChange}
        onAdd={handleAddRole}
        addButtonText="Add Role"
        addButtonIcon={<Plus className="h-4 w-4 mr-1" />}
        searchPlaceholder="Search roles..."
        tableName="Role Management"
        tableDescription="Manage system roles and permissions"
        layout2={true}
        pagination={true}
        paginationType="cursor"
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        onFirstPage={handleFirstPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        currentPageNumber={currentPageIndex + 1}
        totalItems={totalItems}
        currentItems={currentItems}
        isLoading={isLoading}
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
