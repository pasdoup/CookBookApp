import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Link } from "expo-router";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Card } from "../Card";
import { ThemedText } from "../ThemedText";
import { RecipeDesc } from "./RecipeDesc";

type Props =  {
    style?: ViewStyle,
    id: number,
    title: string,
    time: number,
    regime: string,
    type: string,
}

export function RecipeCard ({style, id, title, time, regime, type}: Props) {
    const colors = useThemeColors()
    return (
        <Link href={{pathname: "/recipe/id", params: {id: id}}} asChild>
            <Pressable android_ripple={{color: colors.header, foreground: true}} style={{borderRadius: 8}}>
                <Card style={[style, styles.container, {backgroundColor: colors.card}]}>
                    <ThemedText variant="bodyStrong" color="text" >{title}</ThemedText>
                    <RecipeDesc 
                        type={type as keyof typeof Colors.regime} 
                        regime={regime as keyof typeof Colors.regime} 
                        time={time} 
                    />
                </Card>
            </Pressable>
        </Link>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4, 
        height: 80,
        borderRadius: 8,
    },
    title:{
        fontWeight: 'bold',
    },
    desc: {
        paddingLeft: 4,
    },
})



