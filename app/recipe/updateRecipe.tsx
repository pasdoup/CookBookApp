import { Card } from "@/components/Card";
import Form from "@/components/Form";
import { HeaderBorder } from "@/components/HeaderBorder";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants";
import { RecipeInput } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpdateRecipe() {
  const params = useLocalSearchParams()
  const { getRecipe, updateRecipe } = useRecipes();

  const recipe = getRecipe(Number(params.id));
  
  if (!recipe) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Pressable onPress={router.dismissAll}>
          <Image source={require("@/assets/images/back.png")} style={styles.logo} />
        </Pressable> 
        <View style={[styles.header, {backgroundColor: Colors.peach}]}>
          <ThemedText variant="header">Go back</ThemedText>
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
    <SafeAreaView style={[ styles.container, {backgroundColor: Colors.peach}]}>
      <ScrollView>
        <Card style={[styles.header]} color={Colors.peach} >
          <Pressable onPress={router.back}>
            <Image source={require("@/assets/images/back.png")} style={styles.logo} />
          </Pressable> 
          <ThemedText variant="header">Modifier la recette</ThemedText>
          <HeaderBorder/>
        </Card>
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

