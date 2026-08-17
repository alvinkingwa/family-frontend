import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: "sm" | "md" | "lg";
}

export default function Card({
  children,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const paddingClass = {
    sm: "p-3",
    md: "p-4",
    lg: "p-5",
  }[padding];

  return (
    <View
      className={`
        bg-background-card rounded-xl
        border border-border
        ${paddingClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </View>
  );
}