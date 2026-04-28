import { Colors } from "@/constants";
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

export function RecipeCard ({style, id, title, time, regime, type, color, colorBorder}: Props) {
    return (
        <Link href={{pathname: "/recipe/id", params: {id: id}}} asChild>
            <Pressable android_ripple={{color: color, foreground: true}} style={{borderRadius: 8}}>
                <Card style={[style, styles.container, {borderColor: colorBorder}]} color={color}>
                    <ThemedText variant="bodyStrong" >{title}</ThemedText>
                    <RecipeDesc 
                        type={type as keyof typeof Colors.regimes} 
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
        padding: 4, 
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        borderBottomWidth: 3,
    },
    title:{
        fontWeight: 'bold',
    },
    desc: {
        paddingLeft: 4,
    },
})



