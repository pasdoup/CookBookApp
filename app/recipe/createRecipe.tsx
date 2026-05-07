import { Card } from "@/components/Card";
import Form from "@/components/Form";
import { HeaderBorder } from "@/components/HeaderBorder";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants";
import { RecipeInput } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateRecipe() {
  const { addRecipe } = useRecipes();

  const handleSubmit = async (data: RecipeInput) => {
    await addRecipe(data);
    router.dismissAll()
  };

  return (
    <SafeAreaView style={[ styles.container, {backgroundColor: Colors.peach}]}>
        <Card style={[styles.header, ]} color={Colors.peach}>
          <Pressable onPress={router.back}>
            <Image source={require("@/assets/images/back.png")} style={styles.logo} />
          </Pressable> 
          <ThemedText variant="header">Nouvelle recette</ThemedText>
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
  logo: {
    width: 32, 
    height: 32
  },
  header: {
    padding: Spacing.sm,
    paddingBottom: Spacing.xl,
    height: 100,
  },
})