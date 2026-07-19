

import { Colors, FontSize, Radius, Spacing } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TextInput } from "react-native";
import { Row } from "./Row";

type Props = {
    value: string,
    onChange: (value: string) => void
}

export function SearchBar({value, onChange}: Props) {
    return (
        <Row style={ styles.search } gap={Spacing.xs}> 
            <Ionicons name={'search-outline'} color={Colors.text} />
            <TextInput
                style={styles.input}
                placeholder="Rechercher une recette"
                placeholderTextColor={Colors.text}
                value={value}
                onChangeText={onChange}
            />
        </Row>
    )
}   

const styles = StyleSheet.create({
    search: {
        borderRadius: Radius.lg,
        height: 40,
        paddingHorizontal: Spacing.sm,
        margin: Spacing.sm,
        backgroundColor: Colors.bubblegumLight,
    },
    input: {
        flex: 1,
        fontSize: FontSize.body,
    }
});