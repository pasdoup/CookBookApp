import { Card } from "@/components/Card";
import Form from "@/components/Form";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { RecipeInput } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpdateRecipe() {
  const colors = useThemeColors()
  const params = useLocalSearchParams()
  const { getRecipe, updateRecipe } = useRecipes();

  const recipe = getRecipe(Number(params.id));
  
  if (!recipe) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Pressable onPress={router.dismissAll}>
          <Image source={require("@/assets/images/back.png")} style={styles.logo} />
        </Pressable> 
        <View style={[styles.header, {backgroundColor: colors.header}]}>
          <ThemedText variant="headline">Go back</ThemedText>
        </View>
        <View>
          <ThemedText>Recette introuvable</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const update = async (data: RecipeInput) => { 
   await updateRecipe(recipe.id, data);
    router.navigate({
      pathname: "/recipe/id",
      params: { id: params.id } 
    })
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[styles.header, {backgroundColor: colors.header}]}>
          <Pressable onPress={router.back}>
            <Image source={require("@/assets/images/back.png")} style={styles.logo} />
          </Pressable> 
          <ThemedText variant="headline">Modifier la recette</ThemedText>
        </View>
        <Card>
          <Form onSubmit={update} recipe={recipe} submitLabel="Sauvegarder les modifications"/>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4, 
  },
  logo: {
    width: 32, 
    height: 32
  },
  header: {
    gap: 16,
    padding: 12,
  },
  ingredients: {
    gap: 8,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: Colors.light.text,
  },
  steps: {
    gap: 8,
  },
})

