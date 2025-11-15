// "use client";

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Loader2, Download, Upload, AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
// import { Phase, WorkingDaysType } from "@/lib/types/schedule";

// interface ParsedActivity {
//   phaseId: string;
//   phaseName: string;
//   parentActivityName?: string;
//   name: string;
//   targetUnits: number;
//   startDate: string;
//   endDate: string;
//   workingDaysType: WorkingDaysType;
//   isSubActivity: boolean;
//   rowNumber: number;
// }

// interface ActivityExcelUploadProps {
//   open: boolean;
//   onClose: () => void;
//   onUpload: (activities: ParsedActivity[]) => void;
//   phases: Phase[];
// }

// export const ActivityExcelUpload = ({
//   open,
//   onClose,
//   onUpload,
//   phases,
// }: ActivityExcelUploadProps) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [parsedData, setParsedData] = useState<ParsedActivity[]>([]);
//   const [errors, setErrors] = useState<string[]>([]);
//   const [preview, setPreview] = useState<boolean>(false);

//   const handleFileChange = (files: File[]) => {
//     if (files.length > 0) {
//       setFile(files[0]);
//       setParsedData([]);
//       setErrors([]);
//       setPreview(false);
//     }
//   };

//   const downloadTemplate = () => {
//     // Load xlsx dynamically
//     import('xlsx').then((XLSX) => {
//       // Create template data
//       const templateData = [
//         {
//           Phase: "Construction",
//           "Parent Activity": "",
//           "Activity/Sub-Activity Name": "Panel Installation",
//           Units: 1000,
//           "Start Date": "2024-03-01",
//           "End Date": "2024-03-31",
//           "Working Days": "weekdays",
//         },
//         {
//           Phase: "Construction",
//           "Parent Activity": "Panel Installation",
//           "Activity/Sub-Activity Name": "Mounting Structure Installation",
//           Units: 500,
//           "Start Date": "2024-03-01",
//           "End Date": "2024-03-15",
//           "Working Days": "weekdays",
//         },
//         {
//           Phase: "Construction",
//           "Parent Activity": "Panel Installation",
//           "Activity/Sub-Activity Name": "Solar Panel Mounting",
//           Units: 500,
//           "Start Date": "2024-03-16",
//           "End Date": "2024-03-31",
//           "Working Days": "weekdays",
//         },
//       ];

//       // Create workbook
//       const ws = XLSX.utils.json_to_sheet(templateData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Activities");

//       // Add instructions sheet
//       const instructions = [
//         { Instruction: "How to use this template:" },
//         { Instruction: "" },
//         { Instruction: "1. Fill in the Phase name (must match existing phase)" },
//         { Instruction: "2. Leave 'Parent Activity' blank for main activities" },
//         { Instruction: "3. Fill 'Parent Activity' for sub-activities (use exact parent name)" },
//         { Instruction: "4. Enter Activity/Sub-Activity Name" },
//         { Instruction: "5. Enter Units (target units to complete)" },
//         { Instruction: "6. Enter Start Date (YYYY-MM-DD format)" },
//         { Instruction: "7. Enter End Date (YYYY-MM-DD format)" },
//         { Instruction: "8. Working Days options: weekdays, weekends, all, custom" },
//         { Instruction: "" },
//         { Instruction: "Notes:" },
//         { Instruction: "- Dates must be in YYYY-MM-DD format" },
//         { Instruction: "- Parent activities must be created before sub-activities" },
//         { Instruction: "- Units must be positive numbers" },
//         { Instruction: "- All fields are required except 'Parent Activity'" },
//       ];
//       const wsInstructions = XLSX.utils.json_to_sheet(instructions);
//       XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");

//       // Download
//       XLSX.writeFile(wb, "activity_upload_template.xlsx");
//     });
//   };

//   const parseWorkingDaysType = (value: string): WorkingDaysType => {
//     const normalized = value.toLowerCase().trim();
//     switch (normalized) {
//       case "weekdays":
//       case "weekdays_only":
//         return WorkingDaysType.WEEKDAYS_ONLY;
//       case "weekends":
//       case "all":
//       case "all_days":
//         return WorkingDaysType.ALL_DAYS;
//       case "custom":
//         return WorkingDaysType.CUSTOM;
//       default:
//         return WorkingDaysType.WEEKDAYS_ONLY;
//     }
//   };

//   const validateDate = (dateStr: string): boolean => {
//     const regex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!regex.test(dateStr)) return false;
//     const date = new Date(dateStr);
//     return !isNaN(date.getTime());
//   };

//   const processFile = async () => {
//     if (!file) return;

//     setIsProcessing(true);
//     setErrors([]);
//     setParsedData([]);

//     try {
//       // Load xlsx dynamically
//       const XLSX = await import('xlsx');
      
//       const data = await file.arrayBuffer();
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);

//       const parsedActivities: ParsedActivity[] = [];
//       const validationErrors: string[] = [];

//       jsonData.forEach((row: any, index: number) => {
//         const rowNumber = index + 2; // Excel row number (header is row 1)

//         // Validate required fields
//         if (!row["Phase"]) {
//           validationErrors.push(`Row ${rowNumber}: Phase is required`);
//           return;
//         }
//         if (!row["Activity/Sub-Activity Name"]) {
//           validationErrors.push(`Row ${rowNumber}: Activity/Sub-Activity Name is required`);
//           return;
//         }
//         if (!row["Units"] || row["Units"] <= 0) {
//           validationErrors.push(`Row ${rowNumber}: Units must be a positive number`);
//           return;
//         }
//         if (!row["Start Date"]) {
//           validationErrors.push(`Row ${rowNumber}: Start Date is required`);
//           return;
//         }
//         if (!row["End Date"]) {
//           validationErrors.push(`Row ${rowNumber}: End Date is required`);
//           return;
//         }

//         // Validate dates
//         const startDate = String(row["Start Date"]).trim();
//         const endDate = String(row["End Date"]).trim();
//         if (!validateDate(startDate)) {
//           validationErrors.push(`Row ${rowNumber}: Invalid Start Date format (use YYYY-MM-DD)`);
//           return;
//         }
//         if (!validateDate(endDate)) {
//           validationErrors.push(`Row ${rowNumber}: Invalid End Date format (use YYYY-MM-DD)`);
//           return;
//         }
//         if (new Date(startDate) > new Date(endDate)) {
//           validationErrors.push(`Row ${rowNumber}: Start Date must be before End Date`);
//           return;
//         }

//         // Find phase
//         const phaseName = String(row["Phase"]).trim();
//         const phase = phases.find((p) => p.title.toLowerCase() === phaseName.toLowerCase());
//         if (!phase) {
//           validationErrors.push(`Row ${rowNumber}: Phase "${phaseName}" not found`);
//           return;
//         }

//         // Determine if sub-activity
//         const parentActivityName = row["Parent Activity"] 
//           ? String(row["Parent Activity"]).trim() 
//           : "";
//         const isSubActivity = !!parentActivityName;

//         parsedActivities.push({
//           phaseId: phase.id,
//           phaseName: phase.title,
//           parentActivityName: parentActivityName || undefined,
//           name: String(row["Activity/Sub-Activity Name"]).trim(),
//           targetUnits: Number(row["Units"]),
//           startDate,
//           endDate,
//           workingDaysType: parseWorkingDaysType(
//             row["Working Days"] ? String(row["Working Days"]) : "weekdays"
//           ),
//           isSubActivity,
//           rowNumber,
//         });
//       });

//       if (validationErrors.length > 0) {
//         setErrors(validationErrors);
//         setIsProcessing(false);
//         return;
//       }

//       // Validate parent-child relationships
//       const activityNames = new Set(
//         parsedActivities.filter((a) => !a.isSubActivity).map((a) => a.name)
//       );
//       parsedActivities.forEach((activity) => {
//         if (activity.isSubActivity && activity.parentActivityName) {
//           if (!activityNames.has(activity.parentActivityName)) {
//             validationErrors.push(
//               `Row ${activity.rowNumber}: Parent activity "${activity.parentActivityName}" not found in this file`
//             );
//           }
//         }
//       });

//       if (validationErrors.length > 0) {
//         setErrors(validationErrors);
//         setIsProcessing(false);
//         return;
//       }

//       setParsedData(parsedActivities);
//       setPreview(true);
//     } catch (error) {
//       setErrors(["Failed to process file. Please ensure it's a valid Excel file."]);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleUpload = () => {
//     onUpload(parsedData);
//     handleClose();
//   };

//   const handleClose = () => {
//     setFile(null);
//     setParsedData([]);
//     setErrors([]);
//     setPreview(false);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <FileSpreadsheet className="h-5 w-5" />
//             Upload Activities from Excel
//           </DialogTitle>
//           <DialogDescription>
//             Upload an Excel file to create multiple activities and sub-activities at once
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Download Template */}
//           <Alert>
//             <Download className="h-4 w-4" />
//             <AlertDescription className="flex items-center justify-between">
//               <span>Don't have a template? Download one to get started.</span>
//               <Button variant="outline" size="sm" onClick={downloadTemplate}>
//                 <Download className="h-4 w-4 mr-2" />
//                 Download Template
//               </Button>
//             </AlertDescription>
//           </Alert>

//           {/* File Upload */}
//           <div className="space-y-2">
//             <Label htmlFor="file-upload">Upload Excel File</Label>
//             <Input
//               id="file-upload"
//               type="file"
//               accept=".xlsx,.xls"
//               onChange={(e) => {
//                 const files = e.target.files;
//                 if (files && files.length > 0) {
//                   handleFileChange([files[0]]);
//                 }
//               }}
//             />
//             <p className="text-sm text-muted-foreground">
//               Upload .xlsx or .xls file with activities
//             </p>
//           </div>

//           {/* Process Button */}
//           {file && !preview && (
//             <Button onClick={processFile} disabled={isProcessing} className="w-full">
//               {isProcessing ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Upload className="h-4 w-4 mr-2" />
//                   Process File
//                 </>
//               )}
//             </Button>
//           )}

//           {/* Errors */}
//           {errors.length > 0 && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>
//                 <div className="font-semibold mb-2">
//                   Found {errors.length} error{errors.length > 1 ? "s" : ""}:
//                 </div>
//                 <ul className="list-disc list-inside space-y-1 text-sm">
//                   {errors.map((error, index) => (
//                     <li key={index}>{error}</li>
//                   ))}
//                 </ul>
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Preview */}
//           {preview && parsedData.length > 0 && (
//             <div className="space-y-3">
//               <Alert>
//                 <CheckCircle2 className="h-4 w-4" />
//                 <AlertDescription>
//                   Successfully parsed {parsedData.length} activit
//                   {parsedData.length === 1 ? "y" : "ies"}. Review and confirm to upload.
//                 </AlertDescription>
//               </Alert>

//               <div className="border rounded-lg overflow-hidden">
//                 <div className="max-h-[400px] overflow-y-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-muted sticky top-0">
//                       <tr>
//                         <th className="p-2 text-left">Type</th>
//                         <th className="p-2 text-left">Phase</th>
//                         <th className="p-2 text-left">Name</th>
//                         <th className="p-2 text-right">Units</th>
//                         <th className="p-2 text-left">Dates</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {parsedData.map((activity, index) => (
//                         <tr key={index} className="border-b">
//                           <td className="p-2">
//                             {activity.isSubActivity ? (
//                               <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
//                                 Sub
//                               </span>
//                             ) : (
//                               <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
//                                 Main
//                               </span>
//                             )}
//                           </td>
//                           <td className="p-2">{activity.phaseName}</td>
//                           <td className="p-2">
//                             {activity.isSubActivity && (
//                               <span className="text-xs text-muted-foreground mr-2">
//                                 ↳ {activity.parentActivityName}
//                               </span>
//                             )}
//                             <div className={activity.isSubActivity ? "ml-4" : ""}>
//                               {activity.name}
//                             </div>
//                           </td>
//                           <td className="p-2 text-right">{activity.targetUnits}</td>
//                           <td className="p-2 text-xs text-muted-foreground">
//                             {activity.startDate} to {activity.endDate}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           {preview && (
//             <Button onClick={handleUpload} disabled={parsedData.length === 0}>
//               <Upload className="h-4 w-4 mr-2" />
//               Upload {parsedData.length} Activit{parsedData.length === 1 ? "y" : "ies"}
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ActivityExcelUpload;
