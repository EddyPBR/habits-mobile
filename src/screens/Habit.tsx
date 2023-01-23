import { useEffect, useState } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";

import dayjs from "dayjs";
import clsx from "clsx";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import { HabitEmpty } from "../components/HabitEmpty";

import { getDayHabits } from "../api/getDayHabits";
import { patchToggleHabit } from "../api/patchToggleHabit";

import { generateProgressPercentage } from "../utils/generate-progress-percentage";
interface IHabitParams {
  date: string;
}

interface IHabit {
  id: string;
  title: string;
}

interface IDayInfo {
  completedHabits: string[];
  possibleHabits: IHabit[];
}

export function Habit() {
  const route = useRoute();
  const { date } = route.params as IHabitParams;
  const parsedDate = new Date(date);

  const [dayInfo, setDayInfo] = useState<IDayInfo | null>();
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parsedDayJs = dayjs(date);
  const dayOfWeek = parsedDayJs.format("dddd");
  const dayAndMonth = parsedDayJs.format("DD/MM");
  const isDateInPast = parsedDayJs.endOf("day").isBefore(new Date());

  const habitsProgress = dayInfo?.possibleHabits
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  async function handleToggleHabit(habitId: string) {
    try {
      if (!dayInfo) {
        throw new Error("Client error: impossível alterar hábito inexistente!");
      }

      await patchToggleHabit({ id: habitId });

      const isHabitAlreadyCompleted = dayInfo.completedHabits.includes(habitId);

      let completedHabits: string[] = [];

      setDayInfo((current) => {
        if (!current) return null;

        if (isHabitAlreadyCompleted) {
          completedHabits = current.completedHabits.filter(
            (id) => id !== habitId
          );
        } else {
          completedHabits = [...current.completedHabits, habitId];
        }

        return {
          ...current,
          completedHabits,
        };
      });

      setCompletedHabits(completedHabits);
    } catch (error: any) {
      Alert.alert("Ops", error.message);
    }
  }

  async function loadHabits() {
    try {
      setIsLoading(true);

      const response = await getDayHabits({ date: parsedDate });

      const completedHabits = response.data.completedHabits ?? [];
      const possibleHabits = response.data.possibleHabits;

      setCompletedHabits(completedHabits);

      setDayInfo({
        completedHabits,
        possibleHabits,
      });
    } catch (error: any) {
      Alert.alert("Ops", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadHabits();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            "opacity-50": isDateInPast,
          })}
        >
          {dayInfo && dayInfo.possibleHabits.length > 0 ? (
            dayInfo.possibleHabits.map((habit) => {
              const isChecked = completedHabits.includes(habit.id);

              return (
                <CheckBox
                  key={habit.id}
                  title={habit.title}
                  checked={isChecked}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              );
            })
          ) : (
            <HabitEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar hábitos de uma data passada.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
