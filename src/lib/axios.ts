import axios, { AxiosError } from "axios";

export interface IApiException {
  message: string;
  code: number;
}

export interface IApiErrorDTO {
  message: string;
  code: number;
}

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

export const apiException = (error: Error): IApiException => {
  if (!axios.isAxiosError(error)) {
    const message = error?.message ?? "unknown error";

    return {
      message: `Client error: ${message}`,
      code: 0,
    };
  }

  const axiosError = error as AxiosError<IApiErrorDTO>;

  const message = axiosError.response?.data?.message ?? "Unknown error";
  const code = axiosError.response?.status ?? 0;

  return {
    message,
    code,
  };
};
