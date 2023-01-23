import { useCallback, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";

import { getSummary } from "../api/getSummary";

import { generateDatesFromYearBeginning } from "../utils/generate-range-between-dates";

import { Header } from "../components/Header";
import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Loading } from "../components/Loading";

interface ISummary {
  id: string;
  date: string;
  amount: number;
  completed: number;
}

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearBeginning = generateDatesFromYearBeginning();
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill =
  minimumSummaryDatesSizes - datesFromYearBeginning.length;

export function Home() {
  const { navigate } = useNavigation();

  const [summary, setSummary] = useState<ISummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadSummary() {
    try {
      setIsLoading(true);
      const response = await getSummary();
      setSummary(response.data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadSummary();
    }, [])
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row mt-6 mb-2">
          {weekDays.map((weekDay, index) => (
            <Text
              key={`${weekDay}-${index}`}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          ))}
        </View>

        <View className="flex-row flex-wrap">
          {datesFromYearBeginning.map((date) => {
            const dayWithHabits = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            const amountOfHabits = dayWithHabits?.amount || 0;
            const amountCompleted = dayWithHabits?.completed || 0;

            return (
              <HabitDay
                key={date.toISOString()}
                date={date}
                amountOfHabits={amountOfHabits}
                amountCompleted={amountCompleted}
                onPress={() => navigate("habit", { date: date.toISOString() })}
              />
            );
          })}

          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <View
                key={index}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
