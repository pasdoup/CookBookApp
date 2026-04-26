import { useThemeColors } from "@/hooks/useThemeColors";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

export function EmptyState({ message }: { message: string }) {
  const colors = useThemeColors()
  return (
    <View style={s.emptyState}>
      <ThemedText style={s.emptyText}>{message}</ThemedText>
    </View>
  );
}

const s = StyleSheet.create({
    emptyText:    { textAlign: 'center' },
    emptyState:   { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 20 },

  });