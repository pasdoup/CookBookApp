import { Colors, Spacing } from "@/constants";
import { LogoName } from "@/data/types";
import { StyleSheet, ViewProps } from "react-native";
import { Card } from "./Card";
import { HeaderBorder } from "./HeaderBorder";
import { Row } from "./Row";
import { ThemedText } from "./ThemedText";

type Props = ViewProps & {
    style?: ViewProps,
    title: string,
    subTitle?: string,
    logo: LogoName,
}

export function Header ({style, title, subTitle, logo, ...rest}: Props) {
    return (
        <Card style={styles.header} color={Colors.bubblegum}>
            <Row gap={16}>
                {/* <Image source={logos[logo]} style={styles.logo} /> */}
                <ThemedText variant="header">{title}</ThemedText>
                <ThemedText variant="header" color={Colors.rose}>✦ ✦</ThemedText>
            </Row>
            <ThemedText variant="bodyStrong" color={Colors.rose}>{subTitle}</ThemedText>
            <HeaderBorder/>
        </Card>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: Spacing.sm,
        paddingBottom: Spacing.xl,
        paddingTop: Spacing.xxxl,
        height: 175,
    },
    logo: {
        width: 50, 
        height: 50
    },
});