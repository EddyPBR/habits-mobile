import { api, apiException } from "../lib/axios";

interface IPatchToggleHabit {
  id: string; // uuid
}

export async function patchToggleHabit({ id }: IPatchToggleHabit) {
  try {
    return await api.patch<null>(`habits/${id}/toggle`);
  } catch (error: unknown) {
    throw apiException(error as Error);
  }
}
