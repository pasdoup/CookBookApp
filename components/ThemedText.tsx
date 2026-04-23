import { Colors } from "@/constants/Colors"
import { useThemeColors } from "@/hooks/useThemeColors"
import { StyleSheet, Text, TextProps } from "react-native"

const styles = StyleSheet.create({
    body: {
        fontSize: 10,
        lineHeight: 16,
    },
    bodyStrong: {
        fontSize: 10,
        lineHeight: 16,
        fontWeight: "bold"
    },
    headline: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "bold",
    },
    newRecipe: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: "bold",
        color: '#fff',
    }
})

type Props = TextProps & {
    variant?: keyof typeof styles,
    color?: keyof typeof Colors["light"]
}

export function ThemedText ({style, variant, color, ...rest}: Props) {
    const colors = useThemeColors()
    return (<Text style={[style, styles[variant ?? 'body'], color ? {color: colors[color]} : {}]}{...rest}/>);
}

