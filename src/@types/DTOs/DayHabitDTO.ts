interface IPossibleHabit {
  id: string;
  title: string;
  created_at: string;
}

export interface IDayHabitDTO {
  possibleHabits: IPossibleHabit[];
  completedHabits?: string[]; //uuid
}
