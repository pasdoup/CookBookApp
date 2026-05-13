import { Colors, Radius, Spacing } from "@/constants";
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
        gap={Spacing.xxs} 
        style={[style, 
                styles.container, 
                active ? 
                    colorActive? {backgroundColor: colorActive, borderColor: colorBorder, borderWidth: 1, borderBottomWidth: 3} : {backgroundColor: Colors.cream} 
                : color? 
                    {backgroundColor: color} 
                    : {backgroundColor: Colors.cream},
                {borderColor: colorBorder, borderWidth: 1}]} 
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
        borderRadius: Radius.lg,
        padding: Spacing.xs,
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