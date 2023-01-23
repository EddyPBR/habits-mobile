import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import colors from "tailwindcss/colors";

import { Feather } from "@expo/vector-icons";

import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { createHabit } from "../api/createHabit";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feita",
  "Sexta-feira",
  "Sábado",
];

export function New() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  const [isCreating, setIsCreating] = useState(false);

  function handleToggleWeekDay(weekDayIndex: number) {
    const weekDayAlreadyIncluded = weekDays.includes(weekDayIndex);

    weekDayAlreadyIncluded
      ? setWeekDays((current) =>
          current.filter((weekDay) => weekDay !== weekDayIndex)
        )
      : setWeekDays((current) => [...current, weekDayIndex]);
  }

  async function handleCreateNewHabit() {
    try {
      setIsCreating(true)

      if(!title.trim()) {
        throw new Error("Título é obrigatório!");
      }

      if(weekDays.length === 0) {
        throw new Error("Escolha ao menos um dia!");
      }

      await createHabit({
        title,
        weekDays
      });

      setTitle("");
      setWeekDays([]);

      Alert.alert("Ops", "Hábito foi criado!");
    } catch (error: any) {
      Alert.alert("Ops", error.message);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual o seu comprometimento?
        </Text>

        <TextInput
          placeholder="Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência
        </Text>

        {availableWeekDays.map((weekDay, index) => {
          const isChecked = weekDays.includes(index);

          return (
            <CheckBox
              key={weekDay}
              title={weekDay}
              checked={isChecked}
              onPress={() => handleToggleWeekDay(index)}
            />
          );
        })}

        <TouchableOpacity
          activeOpacity={0.7}
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          onPress={handleCreateNewHabit}
          disabled={isCreating}
        >
          <Feather name="check" size={20} color={colors.white} />

          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
