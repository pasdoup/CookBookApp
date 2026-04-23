import { View, ViewProps, ViewStyle } from "react-native";

type Props = ViewProps & {
    gap?: number,
}

export function Row ({style, gap, ...rest}: Props) {
    return <View style={[style, styles, gap? {gap: gap} : undefined]} {...rest} />
}

const styles: ViewStyle = {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
}