import { View, Text } from "react-native";
import { colors } from "@/constants";

type BadgeVariant = "admin" | "adult" | "child" | "ghost" | "deceased";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const badgeConfig: Record<BadgeVariant, { bg: string; text: string; label: string }> = {
  admin:    { bg: colors.admin.bg,    text: colors.admin.text,    label: "Admin" },
  adult:    { bg: colors.adult.bg,    text: colors.adult.text,    label: "Adult" },
  child:    { bg: colors.child.bg,    text: colors.child.text,    label: "Child" },
  ghost:    { bg: colors.ghost.bg,    text: colors.ghost.text,    label: "Ghost" },
  deceased: { bg: colors.deceased.bg, text: colors.deceased.text, label: "Deceased" },
};

export default function Badge({ variant, label }: BadgeProps) {
  const config = badgeConfig[variant];

  return (
    <View
      className="px-2.5 py-1 rounded-full"
      style={{ backgroundColor: config.bg }}
    >
      <Text
        className="text-xs font-medium"
        style={{ color: config.text }}
      >
        {label ?? config.label}
      </Text>
    </View>
  );
}