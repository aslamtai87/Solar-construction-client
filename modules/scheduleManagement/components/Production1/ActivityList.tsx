import { GenericTable } from "@/components/global/Table/GenericTable";
import { useGetActivity } from "@/hooks/ReactQuery/useSchedule";
import { useProjectStore } from "@/store/projectStore";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/useDialog";
import ConfigurationDialog from "./ConfigurationDialog";
import { useDeleteProductionPlanning } from "@/hooks/ReactQuery/useSchedule";
import { Badge } from "@/components/ui/badge";
import DeleteDialog from "@/components/global/DeleteDialog";

export interface ProductionActivity {
  id: string;
  activityNo: number;
  name: string;
  targetUnit: number;
  startDate: string;
  endDate: string;
  duration: null | number;
  action: null;
  description: null;
  phaseId: string;
  phase: Phase;
  createdAt: string;
  updatedAt: string;
  _count: Count;
  productionPlanning?: ProductionPlanning | null;
}

interface ProductionPlanning {
  id: string;
  name: null;
  productionMethod: string;
  startDate: null;
  endDate: null;
  duration: number;
  targetUnits: null;
  // unitsPerDay: string;
  action: null;
  description: null;
  createdAt: string;
  updatedAt: string;
  crews: Crew2[];
  equipments: Equipment2[];
}

interface Equipment2 {
  id: string;
  quantity: number;
  rate: string;
  subtotal: string;
  equipment: Equipment;
}

interface Equipment {
  id: string;
  name: string;
  description: string;
  price: string;
  pricingType: string;
}

interface Crew2 {
  id: string;
  crew: Crew;
}

interface Crew {
  id: string;
  name: string;
  description: string;
  activityId: string;
  labourers: Labourer2[];
}

interface Labourer2 {
  id: string;
  quantity: number;
  subtotal: null;
  labourer: Labourer;
}

interface Labourer {
  id: string;
  name: string;
  description: null;
  baseRate: string;
  fringeRate: string;
  totalRate: string;
  rateType: string;
}

interface Count {
  subActivities: number;
}

interface Phase {
  id?: string;
  name: string;
}

const ActivityList = () => {
  const { selectedProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const {
    cursor,
    currentPageIndex,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    hasNextPage: hasPrevPage,
    hasPreviousPage,
  } = useCursorPagination();
  const { data: activities, isLoading } = useGetActivity({
    limit: 10,
    projectId: selectedProject?.id || "",
    includeProductionPlanning: true,
    cursor: cursor || undefined,
    search: debouncedSearch || undefined,
  });
  const { dialog: ConfigurationDialogComponent, closeDialog: CloseConfigurationDialog, openEditDialog: openConfigurationDialog } = useDialog();
  const {
    dialog: deleteDialog,
    closeDialog: closeDeleteDialog,
    openEditDialog: openDeleteDialog,
  } = useDialog();
  const deleteProductionPlanning = useDeleteProductionPlanning();
  
  const columns = [
    {
      key: "name",
      header: "Activity Name",
      render: (item: ProductionActivity) => (
        <div className="px-6 py-4">{item.name}</div>
      ),
    },
    {
      key: "phase",
      header: "Phase",
      render: (item: ProductionActivity) => (
        <div className="px-6 py-4">{item.phase.name}</div>
      ),
    },
    {
      key: "targetUnit",
      header: "Target Units",
      render: (item: ProductionActivity) => (
        <div className="px-6 py-4">{item.targetUnit}</div>
      ),
    },
    {
      key: "Actual Duration",
      header: "Actual Duration",
      render: (item: ProductionActivity) => (
        <div className="px-6 py-4">{item.duration || "-"}</div>
      ),
    },
    {
      key: "Estimated Duration",
      header: "Estimated Duration",
      render: (item: ProductionActivity) => (
        <div className="px-6 py-4">
          {item.productionPlanning?.duration ? (
            <span className="font-medium">
              {item.productionPlanning.duration} days
            </span>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      key: "Production Method",
      header: "Production Method",
      render: (item: ProductionActivity) => (
        <div className="px-6 py-4">
          {item.productionPlanning?.productionMethod ? (
            <Badge variant="outline">
              {item.productionPlanning.productionMethod
                .split("_")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </Badge>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      key: "Crews",
      header: "Crews",
      render: (item: ProductionActivity) => (
        <div className="px-6 py-4">
          {item.productionPlanning?.crews?.length ? (
            <Badge variant="secondary">
              {item.productionPlanning.crews.length} crew(s)
            </Badge>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      key: "Equipment",
      header: "Equipment",
      render: (item: ProductionActivity) => (
        <div className="px-6 py-4">
          {item.productionPlanning?.equipments?.length ? (
            <Badge variant="secondary">
              {item.productionPlanning.equipments.length} item(s)
            </Badge>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      key: "Status",
      header: "Status",
      render: (item: ProductionActivity) => (
        <div className="px-6 py-4">
          {item.productionPlanning ? (
            <Badge variant="default">Configured</Badge>
          ) : (
            <Badge variant="secondary">Not Configured</Badge>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: ProductionActivity) => {
        return (
          <div className="px-6 py-4 text-center min-w-[200px]">
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                variant="default"
                onClick={() => openConfigurationDialog(item)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {item.productionPlanning ? "Reconfigure" : "Configure"}
              </Button>
              {item.productionPlanning && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openDeleteDialog(item)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        );
      },
      className: "text-center",
    },
  ];

  return (
    <div>
      <GenericTable
        data={activities?.data.result || []}
        columns={columns}
        tableName="Activities"
        tableDescription="Configure production planning for each activity"
        isLoading={isLoading}
        emptyMessage="No activities available"
        searchText={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        searchPlaceholder="Search activities..."
        showSearch={true}
        pagination={true}
        paginationData={activities?.data.pagination}
        currentPageIndex={currentPageIndex}
        onNextPage={() =>
          handleNextPage(activities?.data.pagination.nextCursor || null)
        }
        onPreviousPage={handlePreviousPage}
        onFirstPage={handleFirstPage}
        hasNextPage={hasPrevPage(activities?.data.pagination)}
        hasPreviousPage={hasPreviousPage}
      />
      <ConfigurationDialog
        open={ConfigurationDialogComponent.open}
        onClose={CloseConfigurationDialog}
        data={ConfigurationDialogComponent.data}
      />
      <DeleteDialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        onConfirm={() => {
          if (deleteDialog.data?.productionPlanning?.id) {
            deleteProductionPlanning.mutate(deleteDialog.data.productionPlanning.id);
          }
          closeDeleteDialog();
        }}
        title="Delete Production Planning"
        description={`Are you sure you want to delete the production planning for "${deleteDialog.data?.name}"? This will remove all crew and equipment assignments.`}
      />
    </div>
  );
};

export default ActivityList;
