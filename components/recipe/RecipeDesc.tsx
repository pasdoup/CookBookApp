import { Colors } from "@/constants/Colors"
import { StyleSheet, ViewStyle } from "react-native"
import { Chip } from "../Chip"
import { Row } from "../Row"

type Props =  {
    style?: ViewStyle,
    type: string,
    regime: keyof typeof Colors.regime,
    time: number
}

export function RecipeDesc ({ type, regime, time }: Props) {
    return (
        <Row style={styles.desc} gap={4}>
            <Chip name={type}/>
            <Chip name={regime} color={regime}  />
            <Chip name={time.toString() + " min"} time={true} />
        </Row>
    )
}

const styles = StyleSheet.create({
    desc: {
        paddingLeft: 4,
    },
})