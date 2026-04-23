import { useThemeColors } from "@/hooks/useThemeColors";
import { StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps

export function Card ({style, ...rest}: Props) {
  const colors = useThemeColors()
  return <View style={[style, styles.container ]} {...rest} />
}

const styles = StyleSheet.create({
  container: {
    padding: 4, 
    borderRadius: 8,
  },
})