import { Colors, FontFamily, FontSize } from "@/constants"
import { StyleSheet, Text, TextProps } from "react-native"

const styles = StyleSheet.create({
    body: {
        fontSize: FontSize.body,
        fontFamily: FontFamily.body,
        fontWeight: 400,
    },
    list: {
        fontSize: FontSize.xl,
        fontFamily: FontFamily.body,
        fontWeight: 400,
    },
    small: {
        fontSize: FontSize.small,
        fontFamily: FontFamily.body,
        fontWeight: 400,
    },
    header: {
        fontSize: FontSize.header1,
        fontFamily: FontFamily.header,
        fontWeight: 700,
    },
    bodyStrong: {
        fontSize: FontSize.header2,
        fontFamily: FontFamily.header,
        fontWeight: 700,
    },
    button: {
        fontSize: FontSize.xl,
        fontFamily: FontFamily.button,
        fontWeight: 600,
    },
    header2: {
        fontSize: FontSize.xxxl,
        fontFamily: FontFamily.body,
        fontWeight: 600,
    },
    link: {
        fontSize: FontSize.body,
        fontFamily: FontFamily.body,
        fontWeight: 400,
        textDecorationLine: 'underline',
    },
})

type Props = TextProps & {
    variant?: keyof typeof styles,
    color?: string
}

export function ThemedText ({style, variant, color, ...rest}: Props) {
    return (<Text style={[style, styles[variant ?? 'body'], color ? {color: color} : {color: Colors.text}]}{...rest}/>);
}

