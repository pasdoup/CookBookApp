import { Colors, FontFamily, FontSize } from "@/constants"
import { StyleSheet, Text, TextProps } from "react-native"

const styles = StyleSheet.create({
    body: {
        fontSize: FontSize.body,
        fontFamily: FontFamily.body,
        fontWeight: 400,
        color: Colors.text
    },
    small: {
        fontSize: FontSize.small,
        fontFamily: FontFamily.body,
        fontWeight: 400,
        color: Colors.text
    },
    header: {
        fontSize: FontSize.header1,
        fontFamily: FontFamily.header,
        fontWeight: 700,
        color: Colors.text
    },
    header2: {
        fontSize: FontSize.header2,
        fontFamily: FontFamily.header,
        fontWeight: 500,
        color: Colors.text
    },
    button: {
        fontSize: FontSize.body,
        fontFamily: FontFamily.button,
        fontWeight: 600,
        color: Colors.text
    },
    bodyStrong: {
        fontSize: FontSize.xl,
        fontFamily: FontFamily.body,
        fontWeight: 400,
        color: Colors.text
        
    },
})

type Props = TextProps & {
    variant?: keyof typeof styles,
    color?: keyof typeof Colors
}

export function ThemedText ({style, variant, color, ...rest}: Props) {
    return (<Text style={[style, styles[variant ?? 'body'], color ? {color: color} : {}]}{...rest}/>);
}

