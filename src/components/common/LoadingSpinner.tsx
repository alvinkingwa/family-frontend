import { View, ActivityIndicator, Text } from "react-native";
import { colors } from "@/constants";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <View
      className={`items-center justify-center gap-3 ${
        fullScreen ? "flex-1 bg-background" : "py-8"
      }`}
    >
      <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      {message ? (
        <Text className="text-text-secondary text-sm">{message}</Text>
      ) : null}
    </View>
  );
}