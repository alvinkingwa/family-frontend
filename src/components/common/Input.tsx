import { View, Text, TextInput, TextInputProps } from "react-native";
import { useState } from "react";
import { colors } from "@/constants";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderClass = error
    ? "border-error"
    : focused
    ? "border-primary"
    : "border-border";

  return (
    <View className="mb-4">
      {label ? (
        <Text className="text-text-primary text-sm font-medium mb-1.5">
          {label}
        </Text>
      ) : null}

      <TextInput
        className={`
          bg-background-card border rounded-xl px-4 py-3.5
          text-text-primary text-base
          ${borderClass}
        `}
        placeholderTextColor={colors.text.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />

      {error ? (
        <Text className="text-error text-xs mt-1">{error}</Text>
      ) : null}

      {hint && !error ? (
        <Text className="text-text-muted text-xs mt-1">{hint}</Text>
      ) : null}
    </View>
  );
}