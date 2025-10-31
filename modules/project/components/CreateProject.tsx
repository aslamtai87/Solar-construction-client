import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProjectValidationSchema,
  ProjectValidationType,
} from "@/lib/validation/project";
import {
  projectSizeUnits,
  projectTypes,
  projectState,
} from "@/lib/types/project";
import { FormFieldWrapper } from "@/components/global/Form/FormFieldWrapper";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { FormSelectField } from "@/components/global/Form/FormSelectField";
import FileUpload from "@/components/global/Form/FileUpload";

const CreateProject = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const form = useForm<ProjectValidationType>({
    resolver: zodResolver(ProjectValidationSchema),
    defaultValues: {
      projectNumber: "",
      projectName: "",
      clientName: "",
      projectLocation: {
        country: "",
        state: "",
        city: "",
        address: "",
      },
      projectSize: 0,
      projectSizeUnit: projectSizeUnits.kW,
      projectType: projectTypes.Rooftop,
      projectState: projectState.preliminaryBidding,
      scope: {
        mechanical: "",
        electrical: "",
        foundational: "",
        civil: "",
      },
      documents: [],
    },
  });

  const onSubmit = (data: ProjectValidationType) => {
    console.log("Form Data:", data);
    console.log("Uploaded Files:", data.documents);
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  console.log(form.watch("projectSize"));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col gap-4 max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-col gap-0">
          <DialogTitle className="text-2xl mb-0">Create Project</DialogTitle>
          <DialogDescription>
            Create a new project by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-0">
              <CardTitle className="text-2xl">Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details for the new project.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <FormFieldWrapper
                label="Project Number"
                name="projectNumber"
                control={form.control}
                type="text"
                placeholder="e.g. SOL-2025-001"
              />
              <FormFieldWrapper
                label="Project Name"
                name="projectName"
                control={form.control}
                type="text"
                placeholder="e.g. Solar Farm Alpha"
              />
              <FormFieldWrapper
                label="Client Name"
                name="clientName"
                control={form.control}
                type="text"
                placeholder="e.g. Green Energy Corp"
              />
              <FormSelectField
                label="Project Type"
                name="projectType"
                control={form.control}
                options={Object.values(projectTypes).map((type) => ({
                  label: type,
                  value: type,
                }))}
              />
              <div className="flex items-start gap-2">
                <div >
                  <FormFieldWrapper
                    label="Project Size"
                    name="projectSize"
                    control={form.control}
                    type="number"
                    placeholder="e.g. 1500"
                    valueAsNumber={true}
                  />
                </div>
                <div >
                  <FormSelectField
                    label="Unit"
                    name="projectSizeUnit"
                    control={form.control}
                    options={Object.values(projectSizeUnits).map((unit) => ({
                      label: unit,
                      value: unit,
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col gap-0">
              <CardTitle className="text-2xl">Project Location</CardTitle>
              <CardDescription>
                Specify the geographical location of the project.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <FormSelectField
                label="Country"
                name="projectLocation.country"
                control={form.control}
                options={[
                  { label: "USA", value: "USA" },
                  { label: "Canada", value: "Canada" },
                  { label: "Mexico", value: "Mexico" },
                ]}
              />
              <FormSelectField
                label="State"
                name="projectLocation.state"
                control={form.control}
                options={[
                  { label: "Texas", value: "Texas" },
                  { label: "California", value: "California" },
                  { label: "Florida", value: "Florida" },
                ]}
              />
              <FormSelectField
                label="City"
                name="projectLocation.city"
                control={form.control}
                options={[
                  { label: "Austin, TX", value: "Austin, TX" },
                  { label: "Dallas, TX", value: "Dallas, TX" },
                  { label: "Houston, TX", value: "Houston, TX" },
                ]}
              />
              <FormFieldWrapper
                label="Address"
                name="projectLocation.address"
                control={form.control}
                type="text"
                placeholder="e.g. 123 Solar St."
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col gap-0">
              <CardTitle className="text-2xl">Project Stage</CardTitle>
              <CardDescription>
                Specify the current stage of the project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormSelectField
                label="Project State"
                name="projectState"
                control={form.control}
                options={Object.values(projectState).map((state) => ({
                  label: state,
                  value: state,
                }))}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col gap-0">
              <CardTitle className="text-2xl">Scope of Work</CardTitle>
              <CardDescription>
                Define the scope of work for the project.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <FormFieldWrapper
                label="Mechanical Scope"
                name="scope.mechanical"
                control={form.control}
                type="textarea"
                placeholder="Describe the mechanical scope..."
              />
              <FormFieldWrapper
                label="Electrical Scope"
                name="scope.electrical"
                control={form.control}
                type="textarea"
                placeholder="Describe the electrical scope..."
              />
              <FormFieldWrapper
                label="Foundational Scope"
                name="scope.foundational"
                control={form.control}
                type="textarea"
                placeholder="Describe the foundational scope..."
              />
              <FormFieldWrapper
                label="Civil Scope"
                name="scope.civil"
                control={form.control}
                type="textarea"
                placeholder="Describe the civil scope..."
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-col gap-0">
              <CardTitle className="text-2xl">Project Documents</CardTitle>
              <CardDescription>
                Upload and manage project-related documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name="documents"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FileUpload
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error}
                    maxFiles={3}
                    maxSize={100 * 1024}
                  />
                )}
              />
            </CardContent>
          </Card>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
            >
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
