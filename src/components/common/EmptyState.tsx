import { View, Text } from "react-native";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16 gap-3">
      <Text className="text-text-primary text-lg font-medium text-center">
        {title}
      </Text>
      <Text className="text-text-secondary text-sm text-center leading-5">
        {message}
      </Text>
      {actionLabel && onAction ? (
        <View className="mt-4 w-48">
          <Button title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}