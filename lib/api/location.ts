import api from "./api";
import { API_ENDPOINTS } from "./endPoints";
import { APISuccessResponse } from "../types/api";
import { Country,State,City } from "../types/location";
import { PaginationResponse } from "../types/pagination";


export const getCountries = async (): Promise<{data: Country[]}> => {
  try {
    const response = await api.get<{data: Country[]}>(API_ENDPOINTS.COUNTRIES);
    return response.data;
  } catch (error) {
    console.error("Get Countries Error:", error);
    throw error;
  }
}

export const getStates = async (countryId: string): Promise<{data: State[]}> => {
  try {
    const endpoint = API_ENDPOINTS.STATES.replace("{countryId}", countryId);
    const response = await api.get<{data: State[]}>(endpoint);
    return { data: response.data.data };
  } catch (error) {
    console.error("Get States Error:", error);
    throw error;
  }
}

export const getCities = async (countryId: string, stateId: string): Promise<{data: City[]}> => {
  try {
    const endpoint = API_ENDPOINTS.CITIES
      .replace("{countryId}", countryId)
      .replace("{stateId}", stateId);
    const response = await api.get<{data: City[]}>(endpoint);
    return { data: response.data.data };
  } catch (error) {
    console.error("Get Cities Error:", error);
    throw error;
  }
}