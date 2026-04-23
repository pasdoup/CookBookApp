

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
        <Row style={[styles.container, {backgroundColor: colors.search}]} gap={8}> 
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
    container: {
        borderRadius: 16,
        height: 40,
        paddingHorizontal: 12,
        margin: 12,
    },
    logo: {
        width: 16,
        height: 16,
    },
    input: {
        flex: 1,
    }
});