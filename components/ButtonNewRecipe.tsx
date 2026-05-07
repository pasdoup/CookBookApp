import { Colors, Radius, Spacing } from "@/constants";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";

type Props = ViewProps & {
    style?: ViewProps,
}

export function ButtonNewRecipe({style, ...rest}: Props) {
    return (
        <Link href="/recipe/createRecipe" asChild>
            <Pressable android_ripple={{color: Colors.green, foreground: true}} style={{borderRadius: 8}}>
                <View style={[styles.container, style]} {...rest}>
                    <ThemedText variant="button" color={Colors.green}>+</ThemedText>
                </View>
            </Pressable>   
        </Link>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        height: 70,
        width: 70,
        borderRadius: Radius.full,
        backgroundColor: Colors.mint, 
        borderColor: Colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderBottomWidth: 5,
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{translateX: -35}],
    },
});