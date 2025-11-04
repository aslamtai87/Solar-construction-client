export enum projectTypes {
    Rooftop = "Rooftop",
    GroundMount = "Ground Mount",
    SingleAxisTracker = "Single Axis Tracker",
    Carport = "Carport",
}

export enum projectSizeUnits {
    kW = "kW",
    MW = "MW",
    GW = "GW",
}

export enum projectState {
    preliminaryBidding = "Preliminary Bidding",
    finalBidding = "Final Bidding",
    awarded = "Project Awarded / NTP",
    inProgress = "In Progress",
}

// Import WorkingDaysConfig from schedule types for project-level configuration
import type { WorkingDaysConfig } from "./schedule";
export type { WorkingDaysConfig };


export interface ProjectDTO {
  projectName: string;
  projectNumber: string;
  clientName: string;
  projectSize: number;
  projectSizeUnit: string;
  projectType: string;
  projectState: string;
  scope: Scope;
  projectDocumentation: string[];
  location: Location;
  workingDaysConfig?: WorkingDaysConfig;
}

interface Location {
  countryId: string;
  stateId: string;
  cityId: string;
  address: string;
}

interface Scope {
  mechanicalScope: string | null;
  electricalScope: string | null;
  civilScope: string | null;
  foundationalScope: string | null;
}
export interface ProjectResponse {
  id: string;
  projectName: string;
  projectNumber: string;
  projectSize: number;
  projectUnit: string;
  projectType: string;
  projectState: string;
  createdById: string;
  createdAt: string;
  location: ResponseLocation;
}

interface ResponseLocation {
  country: Country;
  state: Country;
  city: Country;
}

interface Country {
  id: string;
  name: string;
}
export interface ProjectByIdResponse {
  id: string;
  projectName: string;
  projectNumber: string;
  clientName: string;
  projectSize: number;
  projectUnit: string;
  projectType: string;
  projectState: string;
  scope: Scope;
  projectDocumentation: any[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  location: ResponseLocation;
  workingDaysConfig?: WorkingDaysConfig;
}

interface Creator {
  id: string;
  email: string;
  fullName: string;
  companyType: string;
  organizationName: string;
}