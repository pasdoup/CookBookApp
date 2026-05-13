import { Colors, FontSize, Spacing } from "@/constants"
import { StyleSheet, ViewStyle } from "react-native"
import { Chip } from "../Chip"
import { Row } from "../Row"

type Props =  {
    style?: ViewStyle,
    type: keyof typeof Colors.types,
    regime: keyof typeof Colors.regimes,
    time: number
}

export function RecipeDesc ({ type, regime, time }: Props) {
    return (
        <Row style={styles.desc} gap={Spacing.md}>
            <Chip name={type} color={Colors.types[type].bg} colorBorder={Colors.types[type].bg}/>
            <Chip name={regime} color={Colors.regimes[regime].bg} colorBorder={Colors.regimes[regime].bg} />
            <Chip name={time.toString() + " min"} time={true} colorBorder={Colors.cream}/>
        </Row>
    )
}

const styles = StyleSheet.create({
    desc: {
        paddingLeft: Spacing.xxs,
    },
    chip: {
        fontSize: FontSize.small,
    },
})