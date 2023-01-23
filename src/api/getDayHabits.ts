import { api, apiException } from "../lib/axios";
import { IDayHabitDTO } from "../@types/DTOs";

interface IGetDayHabits {
  date: Date;
}

export async function getDayHabits({ date }: IGetDayHabits) {
  try {
    return await api.get<IDayHabitDTO>("day", {
      params: {
        date,
      },
    });
  } catch (error: unknown) {
    throw apiException(error as Error);
  }
}
