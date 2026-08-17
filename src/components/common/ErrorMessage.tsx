import { View, Text } from "react-native";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <View className="bg-red-50 border border-error rounded-xl px-4 py-3 mb-4">
      <Text className="text-error text-sm">{message}</Text>
    </View>
  );
}