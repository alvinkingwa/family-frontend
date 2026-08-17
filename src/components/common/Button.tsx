import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { colors } from "@/constants";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = true,
}: ButtonProps) {
  const baseClass = "items-center justify-center rounded-xl flex-row gap-2";

  const variantClass = {
    primary: "bg-primary",
    secondary: "bg-primary-lighter",
    outline: "bg-transparent border border-primary",
    ghost: "bg-transparent",
  }[variant];

  const sizeClass = {
    sm: "px-4 py-2",
    md: "px-6 py-3.5",
    lg: "px-8 py-4",
  }[size];

  const textVariantClass = {
    primary: "text-white",
    secondary: "text-primary",
    outline: "text-primary",
    ghost: "text-primary",
  }[variant];

  const textSizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  const opacityClass = disabled || loading ? "opacity-50" : "opacity-100";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${baseClass}
        ${variantClass}
        ${sizeClass}
        ${opacityClass}
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? colors.text.inverse : colors.primary.DEFAULT}
        />
      ) : null}
      <Text className={`font-medium ${textVariantClass} ${textSizeClass}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}