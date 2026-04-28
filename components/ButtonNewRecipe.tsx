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
            <Pressable android_ripple={{color: Colors.rose, foreground: true}} style={{borderRadius: 8}}>
                <View style={[styles.container, style]} {...rest}>
                    <ThemedText variant="button" color={Colors.rose}>Créer une recette</ThemedText>
                </View>
            </Pressable>   
        </Link>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        height: 75,
        width: 180,
        borderRadius: Radius.xl,
        backgroundColor: Colors.bubblegum, 
        borderColor: Colors.rose,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderBottomWidth: 5,
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{translateX: -90}],
    },
});