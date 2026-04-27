

import { Colors, Radius, Spacing } from "@/constants";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, StyleSheet, TextInput } from "react-native";
import { Row } from "./Row";

type Props = {
    value: string,
    onChange: (value: string) => void
}

export function SearchBar({value, onChange}: Props) {
    const colors = useThemeColors()
    return (
        <Row style={ styles.search } gap={Spacing.xs}> 
            <Image source={require("@/assets/images/search.png")} style={styles.logo} />
            <TextInput
                style={styles.input}
                placeholder="Rechercher une recette"
                placeholderTextColor={colors.text}
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
        backgroundColor: Colors.vanilla,
    },
    logo: {
        width: 16,
        height: 16,
    },
    input: {
        flex: 1,
    }
});