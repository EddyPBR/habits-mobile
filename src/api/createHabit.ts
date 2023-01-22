import { api, apiException } from "../lib/axios";

interface ICreateHabit {
  title: string;
  weekDays: number[];
}

export async function createHabit({ title, weekDays }: ICreateHabit) {
  try {
    return await api.post<void>("habits", {
      title,
      weekDays,
    });
  } catch (error: unknown) {
    throw apiException(error as Error);
  }
}
