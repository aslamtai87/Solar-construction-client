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

export interface ProjectListResponse {
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
  id: string;
  projectId: string;
  countryId: string;
  stateId: string;
  cityId: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  country: Country;
  state: Country;
  city: Country;
}

interface Country {
  id: string;
  name: string;
}