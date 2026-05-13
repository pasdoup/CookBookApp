import { Card } from "@/components/Card";
import Form from "@/components/Form";
import { HeaderBorder } from "@/components/HeaderBorder";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants";
import { RecipeInput } from "@/data/types";
import { useRecipes } from "@/data/useRecipes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateRecipe() {
  const { addRecipe } = useRecipes();

  const handleSubmit = async (data: RecipeInput) => {
    await addRecipe(data);
    router.dismissAll()
  };

  return (
    <SafeAreaView style={[ styles.container, {backgroundColor: Colors.peach}]}>
      <Card style={styles.header} color={Colors.peach}>
        <Pressable onPress={router.back}>
          <Ionicons name='arrow-back-sharp' color={ Colors.orange } size={32}/>
        </Pressable> 
          <Row gap={Spacing.md}>
              <ThemedText variant="header" color={ Colors.orange }>Nouvelle recette</ThemedText>
              <Ionicons name='sparkles-sharp' color={ Colors.orange } size={30}/>
          </Row>
          <HeaderBorder/>
      </Card>
      <ScrollView>
        <Card>
          <Form onSubmit={handleSubmit} submitLabel="Créer la recette"/>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.sm,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xxxl,
    height: 175,
  },
})