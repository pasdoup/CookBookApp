import { Colors } from "@/constants";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";

type Props = ViewProps & {
    style?: ViewProps,
    label: string,
    color: keyof typeof Colors
}

export function ButtonNewRecipe({style, label, color, ...rest}: Props) {
    return (
        <Link href="/recipe/createRecipe" asChild>
            <Pressable android_ripple={{color: color, foreground: true}} style={{borderRadius: 8}}>
                <View style={[styles.container, style]} {...rest}>
                    <ThemedText variant="body">+</ThemedText>
                </View>
            </Pressable>   
        </Link>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 75,
        height: 75,
        borderRadius: 999,
        backgroundColor: '#0d0e61',
        alignItems: 'center',
        justifyContent: 'center',
    },
});