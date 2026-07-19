import { Colors, Radius, Spacing } from "@/constants";
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
    color: string,
    colorBorder: string,
}

export function RecipePreview ({style, id, title, time, regime, type, color, colorBorder}: Props) {
    return (
        <Link href={{pathname: "/recipe/id", params: {id: id}}} asChild>
            <Pressable android_ripple={{color: color, foreground: true}} style={{borderRadius: Radius.sm}}>
                <Card style={[style, styles.container, {borderColor: colorBorder}]} color={color}>
                    <ThemedText variant="header2" >{title}</ThemedText>
                    <RecipeDesc 
                        type={type as keyof typeof Colors.types} 
                        regime={regime as keyof typeof Colors.regimes} 
                        time={time} 
                    />
                </Card>
            </Pressable>
        </Link>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.sm, 
        height: 100,
        borderRadius: Radius.sm,
        borderWidth: 2,
        borderBottomWidth: 4,
        gap: Spacing.xxs,
    },
})



