import { Colors } from "@/constants";
import { View, ViewProps } from "react-native";

type Props = ViewProps & {
  color?: string
}

export function Card ({style, color, ...rest}: Props) {
  return <View style={[style,  color ? {backgroundColor: color} : {backgroundColor: Colors.vanilla}  ]} {...rest} />
}