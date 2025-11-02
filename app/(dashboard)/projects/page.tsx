"use client";
import { GenericTable } from '@/components/global/Table/GenericTable';
import { useTableState } from '@/hooks/useTableState';
import { useDialog } from '@/hooks/useDialog';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import DeleteDialog from '@/components/global/DeleteDialog';
import { useGetProjects, useDeleteProject } from '@/hooks/ReactQuery/useProject';
import { ProjectResponse } from '@/lib/types/project';
import { Badge } from '@/components/ui/badge';
import CreateProject from '@/modules/project/components/CreateProject';
import UpdateProject from '@/modules/project/components/UpdateProject';
import ProjectDetailDialog from '@/modules/project/components/ProjectDetailDialog';
import { useProjectStore } from '@/store/projectStore';
import { useRouter } from 'next/navigation';

const ProjectsPage = () => {
  const { searchText, handleSearchChange } = useTableState();
  const router = useRouter();
  
  const { data: projectsData, isLoading, refetch } = useGetProjects();
  const deleteProject = useDeleteProject();
  const { setSelectedProject } = useProjectStore();

  const { 
    dialog: createDialog, 
    openCreateDialog, 
    closeDialog: closeCreateDialog 
  } = useDialog();
  
  const { 
    dialog: editDialog, 
    openEditDialog, 
    closeDialog: closeEditDialog 
  } = useDialog();
  
  const { 
    dialog: detailDialog, 
    openEditDialog: openDetailDialog, 
    closeDialog: closeDetailDialog 
  } = useDialog();
  
  const { 
    dialog: deleteDialog, 
    openEditDialog: openDeleteDialog, 
    closeDialog: closeDeleteDialog 
  } = useDialog();

  const handleDelete = (id: string) => {
    deleteProject.mutate(id, {
      onSuccess: () => {
        closeDeleteDialog();
        refetch();
      }
    });
  };

  const handleSelectProject = (project: ProjectResponse) => {
    setSelectedProject(project);
    router.push('/dashboard');
  };

  const handleViewDetails = (project: ProjectResponse) => {
    openDetailDialog(project);
  };

  const columns = [
    {
      key: "projectNumber",
      header: "Project Number",
      render: (project: ProjectResponse) => (
        <div className="p-4 font-medium text-black">{project.projectNumber}</div>
      ),
    },
    {
      key: "projectName",
      header: "Project Name",
      render: (project: ProjectResponse) => (
        <div className="p-4">
          <div className="font-medium text-black">{project.projectName}</div>
          <div className="text-sm text-gray-500">{project.location.city.name}, {project.location.state.name}</div>
        </div>
      ),
    },
    {
      key: "projectSize",
      header: "Size",
      render: (project: ProjectResponse) => (
        <div className="p-4 text-gray-700">
          {project.projectSize} {project.projectUnit}
        </div>
      ),
    },
    {
      key: "projectType",
      header: "Type",
      render: (project: ProjectResponse) => (
        <div className="p-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {project.projectType}
          </Badge>
        </div>
      ),
    },
    {
      key: "projectState",
      header: "Status",
      render: (project: ProjectResponse) => (
        <div className="p-4">
          <Badge 
            variant="outline" 
            className={
              project.projectState === "In Progress" 
                ? "bg-green-50 text-green-700 border-green-200" 
                : project.projectState === "Preliminary Bidding"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }
          >
            {project.projectState}
          </Badge>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (project: ProjectResponse) => (
        <div className="p-4 text-gray-600">
          {new Date(project.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (project: ProjectResponse) => (
        <div className="p-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewDetails(project)}
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(project)}
            className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDeleteDialog(project)}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <GenericTable
        data={projectsData || []}
        columns={columns}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onAdd={openCreateDialog}
        addButtonText="Create Project"
        addButtonIcon={<Plus className="h-4 w-4 mr-1" />}
        searchPlaceholder="Search projects..."
        tableName="Projects"
        tableDescription="Manage all your solar construction projects"
        isLoading={isLoading}
        pagination={false}
        showDatePicker={false}
      />

      <CreateProject 
        open={createDialog.open} 
        onClose={() => {
          closeCreateDialog();
          refetch();
        }} 
      />

      {editDialog.data && (
        <UpdateProject
          open={editDialog.open}
          onClose={() => {
            closeEditDialog();
            refetch();
          }}
          projectData={editDialog.data}
        />
      )}

      {detailDialog.data && (
        <ProjectDetailDialog
          open={detailDialog.open}
          onClose={closeDetailDialog}
          projectData={detailDialog.data}
        />
      )}

      <DeleteDialog 
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={() => {
          if (deleteDialog.data?.id) {
            handleDelete(deleteDialog.data.id);
          }
        }}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteDialog.data?.projectName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProjectsPage;
