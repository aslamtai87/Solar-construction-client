import { AxiosError } from "axios";

export interface APISuccessResponse {
  message: string;
}

export interface ErrorPayload {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiError = AxiosError<ErrorPayload>;