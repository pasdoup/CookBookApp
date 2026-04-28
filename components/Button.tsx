import { Radius, Spacing } from "@/constants";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";

type Props = ViewProps & {
    style?: ViewProps,
    title: string,
    color: string,
    colorBorder: string,
    height?: number,
    width?: number,
    onSubmit?: () => void,
}

export function Button({style, title, color, colorBorder, height=75, width=180, onSubmit, ...rest}: Props) {
    return (
            <Pressable android_ripple={{color: colorBorder, foreground: true}} style={{borderRadius: 8}} >
                <View style={[
                    styles.container, 
                    style, 
                    {height: 75,
                    width: 200,
                    borderColor: colorBorder,
                    backgroundColor: color, }]} 
                    {...rest}>
                    <ThemedText variant="button" color={colorBorder}>{title}</ThemedText>
                </View>
            </Pressable>   
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: Radius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderBottomWidth: 5,
        left: '25%'
    },
});