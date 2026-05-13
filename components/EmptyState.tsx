import { Spacing } from "@/constants";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={s.emptyState}>
      <ThemedText style={s.emptyText}>{message}</ThemedText>
    </View>
  );
}

const s = StyleSheet.create({
    emptyText: { 
      textAlign: 'center' 
    },
    emptyState: { 
      alignItems: 'center', 
      justifyContent: 'center', 
      paddingVertical: Spacing.xxxl, 
      paddingHorizontal: Spacing.lg 
    },
  });