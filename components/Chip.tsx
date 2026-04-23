import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, StyleSheet, ViewProps } from "react-native";
import { Row } from "./Row";
import { ThemedText } from "./ThemedText";

type Props = ViewProps & {
    style?: ViewProps,
    name: string,
    color?: keyof typeof Colors.regime,
    time?: boolean,
    active?: boolean,
}

export function Chip ({style, name, color, time, active, ...rest}: Props) {
    const colors = useThemeColors()
    return (
    <Row 
        gap={4} 
        style={[style, 
                styles.container, 
                active ? styles.activeChip : color? {backgroundColor: Colors.regime[color].bg} : {backgroundColor: colors.search}]} {...rest} >
        {time ? <Image source={require("@/assets/images/time-left.png")} style={styles.time} /> : null}
        <ThemedText variant="body" >{name}</ThemedText>
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
    activeChip: {
        borderWidth: 1,
        backgroundColor: 'red',
    }
});