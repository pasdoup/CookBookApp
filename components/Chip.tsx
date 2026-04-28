import { Colors } from "@/constants";
import { Image, StyleSheet, ViewProps } from "react-native";
import { Row } from "./Row";
import { ThemedText } from "./ThemedText";

type Props = ViewProps & {
    style?: ViewProps,
    name: string,
    color?: string,
    colorActive?: string,
    colorBorder?: string,
    time?: boolean,
    active?: boolean,
}

export function Chip ({style, name, color, colorActive, colorBorder, time, active, ...rest}: Props) {
    return (
    <Row 
        gap={4} 
        style={[style, 
                styles.container, 
                active ? 
                    colorActive? {backgroundColor: colorActive, borderColor: colorBorder, borderWidth: 1} : {backgroundColor: Colors.vanilla} 
                : color? 
                    {backgroundColor: color} 
                    : {backgroundColor: Colors.vanilla}]} 
                {...rest} >
        {time ? 
            <Image source={require("@/assets/images/time-left.png")} style={styles.time} /> 
        : null}
        <ThemedText variant="body" >{name === "<= Toutes" ? "Toutes" : name}</ThemedText>
    </Row>)
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        borderRadius: 16,
        padding: 8,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    time: {
        width: 12,
        height: 12,
        marginRight: 4,
    },

});