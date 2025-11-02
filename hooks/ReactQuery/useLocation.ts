import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/endPoints";
import { toast } from "sonner";
import { PaginationResponse } from "@/lib/types/pagination";
import { Country,State,City } from "@/lib/types/location";
import { ApiError } from "@/lib/types/api";
import { getCities, getCountries, getStates } from "@/lib/api/location";


export const useGetCountries = () => {
  return useQuery<{data: Country[]}, ApiError>({
    queryKey: [QUERY_KEYS.COUNTRIES],
    queryFn: () => getCountries(),
  });
};
export const useGetStates = (countryId: string) => {
  return useQuery<{data: State[]}, ApiError>({
    queryKey: [QUERY_KEYS.STATES, countryId],
    queryFn: () => getStates(countryId),
    enabled: !!countryId,
  });
};

export const useGetCities = (countryId: string, stateId: string) => {
  return useQuery<{data: City[]}, ApiError>({
    queryKey: [QUERY_KEYS.CITIES, countryId, stateId],
    queryFn: () => getCities(countryId, stateId),
    enabled: !!countryId && !!stateId,
  });
}

