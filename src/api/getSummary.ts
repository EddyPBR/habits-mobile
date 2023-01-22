import { ISummaryDTO } from "../@types/DTOs";
import { api, apiException } from "../lib/axios";

export async function getSummary() {
  try {
    return await api.get<ISummaryDTO[]>("summary");
  } catch (error: unknown) {
    throw apiException(error as Error);
  }
}
