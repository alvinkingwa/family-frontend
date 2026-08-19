import { View, Text, Image } from "react-native";
import { colors } from "../../constants";

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isAdmin?: boolean;
  isDeceased?: boolean;
  isGhost?: boolean;
}

export default function Avatar({
  firstName = "",
  lastName = "",
  photoUrl,
  size = "md",
  isAdmin = false,
  isDeceased = false,
  isGhost = false,
}: AvatarProps) {
  const sizeMap = {
    sm: { container: "w-8 h-8", text: "text-xs", border: 1.5 },
    md: { container: "w-10 h-10", text: "text-sm", border: 2 },
    lg: { container: "w-14 h-14", text: "text-lg", border: 2.5 },
    xl: { container: "w-20 h-20", text: "text-2xl", border: 3 },
  }[size];

  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  const bgColor = isDeceased
    ? colors.deceased.bg
    : isGhost
    ? colors.ghost.bg
    : isAdmin
    ? colors.primary.DEFAULT
    : colors.primary.light;

  const textColor = isDeceased
    ? colors.deceased.text
    : isGhost
    ? colors.ghost.text
    : colors.text.inverse;

  return (
    <View
      className={`${sizeMap.container} rounded-full items-center justify-center overflow-hidden`}
      style={{
        backgroundColor: bgColor,
        borderWidth: isGhost ? sizeMap.border : 0,
        borderColor: colors.ghost.border,
        borderStyle: isGhost ? "dashed" : "solid",
        opacity: isDeceased ? 0.6 : 1,
      }}
    >
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <Text
          className={`${sizeMap.text} font-medium`}
          style={{ color: textColor }}
        >
          {isGhost ? "?" : initials}
        </Text>
      )}
    </View>
  );
}