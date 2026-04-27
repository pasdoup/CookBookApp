import { Colors } from "@/constants";
import { useThemeColors } from "@/hooks/useThemeColors";
import { StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps & {
  color?: string
}

export function Card ({style, color, ...rest}: Props) {
  const colors = useThemeColors()
  return <View style={[style, styles.container, color ? {backgroundColor: color} : {backgroundColor: Colors.cream}  ]} {...rest} />
}

const styles = StyleSheet.create({
  container: {
    padding: 4, 
  },
})