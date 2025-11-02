"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetProjectById } from "@/hooks/ReactQuery/useProject";
import { ProjectResponse } from "@/lib/types/project";
import { Calendar, MapPin, User, Package, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectDetailDialogProps {
  open: boolean;
  onClose: () => void;
  projectData: ProjectResponse;
}

const ProjectDetailDialog = ({
  open,
  onClose,
  projectData,
}: ProjectDetailDialogProps) => {
  const { data: fullProjectData, isLoading } = useGetProjectById(projectData.id);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Project Details...</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!fullProjectData) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-green-50 text-green-700 border-green-200";
      case "Preliminary Bidding":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Final Bidding":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Project Awarded / NTP":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {fullProjectData.projectName}
              </DialogTitle>
              <DialogDescription className="text-base">
                Project #{fullProjectData.projectNumber}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={getStatusColor(fullProjectData.projectState)}>
              {fullProjectData.projectState}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Client Name</p>
                <p className="font-medium">{fullProjectData.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Project Type</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {fullProjectData.projectType}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Project Size</p>
                <p className="font-medium">
                  {fullProjectData.projectSize} {fullProjectData.projectUnit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Created By</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{fullProjectData.creator.fullName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Country</p>
                  <p className="font-medium">{fullProjectData.location.country.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">State</p>
                  <p className="font-medium">{fullProjectData.location.state.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">City</p>
                  <p className="font-medium">{fullProjectData.location.city.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scope of Work */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Scope of Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fullProjectData.scope.mechanicalScope && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Mechanical Scope</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {fullProjectData.scope.mechanicalScope}
                  </p>
                </div>
              )}
              {fullProjectData.scope.electricalScope && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Electrical Scope</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {fullProjectData.scope.electricalScope}
                  </p>
                </div>
              )}
              {fullProjectData.scope.foundationalScope && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Foundational Scope</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {fullProjectData.scope.foundationalScope}
                  </p>
                </div>
              )}
              {fullProjectData.scope.civilScope && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Civil Scope</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {fullProjectData.scope.civilScope}
                  </p>
                </div>
              )}
              {!fullProjectData.scope.mechanicalScope &&
                !fullProjectData.scope.electricalScope &&
                !fullProjectData.scope.foundationalScope &&
                !fullProjectData.scope.civilScope && (
                  <p className="text-sm text-gray-500 italic">No scope information available</p>
                )}
            </CardContent>
          </Card>

          {/* Project Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Created</p>
                <p className="font-medium">
                  {new Date(fullProjectData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium">
                  {new Date(fullProjectData.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Project Documentation */}
          {fullProjectData.projectDocumentation && fullProjectData.projectDocumentation.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fullProjectData.projectDocumentation.map((doc: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">Document {index + 1}</span>
                      </div>
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Organization</p>
                <p className="font-medium">{fullProjectData.creator.organizationName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Company Type</p>
                <p className="font-medium">{fullProjectData.creator.companyType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Email</p>
                <p className="font-medium">{fullProjectData.creator.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailDialog;
