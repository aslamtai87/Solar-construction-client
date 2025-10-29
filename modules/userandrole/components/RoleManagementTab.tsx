'use client';
import React from 'react';
import { GenericTable } from '@/components/global/Table/GenericTable';
import { useTableState } from '@/hooks/useTableState';
import { useDialog } from '@/hooks/useDialog';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import RoleDialog from './RoleDialog';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string;
}

// Static data for now
const staticRoles: Role[] = [
  { 
    id: '1', 
    name: 'Admin', 
    description: 'Full system access',
    permissions: 'All Permissions'
  },
  { 
    id: '2', 
    name: 'Manager', 
    description: 'Manage team and projects',
    permissions: 'Read, Write, Update'
  },
  { 
    id: '3', 
    name: 'User', 
    description: 'Basic user access',
    permissions: 'Read Only'
  },
  { 
    id: '4', 
    name: 'Viewer', 
    description: 'View-only access',
    permissions: 'Read Only'
  },
];

const RoleManagementTab = () => {
  const {
    currentPage,
    setCurrentPage,
    searchText,
    debouncedSearchText,
    handleSearchChange,
  } = useTableState();

  const { dialog, openCreateDialog, openEditDialog, closeDialog } = useDialog<Role>();

  // Filter roles based on search
  const filteredRoles = staticRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
      role.description.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
      role.permissions.toLowerCase().includes(debouncedSearchText.toLowerCase())
  );

  const handleDelete = (id: string) => {
    console.log('Delete role:', id);
    // TODO: Implement delete logic
  };

  const handleEdit = (role: Role) => {
    openEditDialog(role);
  };

  const columns = [
    {
      key: 'name',
      header: 'Role Name',
      render: (role: Role) => (
        <div className="p-4 font-medium text-black">{role.name}</div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (role: Role) => (
        <div className="p-4 text-gray-600">{role.description}</div>
      ),
    },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (role: Role) => (
        <div className="p-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-600">
            {role.permissions}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (role: Role) => (
        <div className="p-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(role)}
            className="border-gray-300 hover:bg-gray-100"
          >
            <Pencil className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(role.id)}
            className="border-red-300 text-red-600 hover:bg-red-50"
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
        data={filteredRoles}
        columns={columns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={1}
        nextPage={false}
        previousPage={false}
        searchValue={searchText}
        onSearchChange={handleSearchChange}
        onAdd={openCreateDialog}
        addButtonText="Add Role"
        addButtonIcon={<Plus className="h-4 w-4 mr-1" />}
        searchPlaceholder="Search roles..."
        tableName="Role Management"
        tableDescription="Manage system roles and permissions"
        layout2={true}
        pagination={false}
      />
      
      <RoleDialog
        open={dialog.open}
        onClose={closeDialog}
        mode={dialog.mode}
        roleData={dialog.data}
      />
    </div>
  );
};

export default RoleManagementTab;
