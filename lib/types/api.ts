import { AxiosError } from "axios";

export interface APISuccessResponse {
  message: string;
}
interface ErrorPayload {
  message: string[];
  error: string;
  statusCode: number;
}

export type ApiError = AxiosError<ErrorPayload>;
