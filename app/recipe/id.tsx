import { Card } from "@/components/Card";
import { HeaderBorder } from "@/components/HeaderBorder";
import { RecipeDesc } from "@/components/recipe/RecipeDesc";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants";
import { formatIngredient } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Recipe() {
  const params = useLocalSearchParams()
  const { getRecipe, deleteRecipe, addRecipeToShoppingList } = useRecipes();

  const recipe = getRecipe(Number(params.id));


  if (!recipe) {
    return (
      <SafeAreaView style={[ {backgroundColor: Colors.peach}]}>
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

    const handleDelete = () => {
    Alert.alert(
      'Supprimer la recette',
      `Voulez-vous vraiment supprimer "${recipe.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteRecipe(recipe.id);
            router.dismissAll()
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[ {backgroundColor: Colors.peach}]}>
      <ScrollView >
        {/*------------------------ Header ------------------------*/}
        <Card style={styles.header} color={Colors.peach}>
          <Pressable onPress={router.dismissAll}>
            <Image source={require("@/assets/images/back.png")} style={styles.logo} />
          </Pressable>
          <ThemedText variant="header">{recipe.title}</ThemedText>
          <RecipeDesc type={recipe.type} regime={recipe.regime as keyof typeof Colors.regimes} time={recipe.time} />
          <HeaderBorder/>
        </Card>
        {/*------------------------ Ingredients ------------------------*/}
        <Card>
        <Card style={styles.ingredients}>
          <ThemedText variant="header">Ingrédients</ThemedText>
          {recipe.ingredients.map((ingredient, index) => (
            <Row gap={4} key={index}>
              <View style={styles.ingrDot} />
              <ThemedText>{formatIngredient(ingredient)}</ThemedText>
            </Row>
          ))}
        </Card>
        {/*------------------------ Steps ------------------------*/}
        <Card style={styles.steps}>
          <ThemedText variant="header">Étapes</ThemedText>
          {recipe.steps.map((step, index) => (
            <Row gap={4} key ={index}>
              <View style={styles.stepCircle}>
                  <Text style={styles.body}>{index + 1}</Text>
              </View>
              <ThemedText>{step}</ThemedText>
            </Row>
          ))}
        </Card>
        {/*------------------------ Actions ------------------------*/}
        <Card>
        <Link href={{pathname: "/recipe/updateRecipe", params: {id: recipe.id}}} asChild>
          <Pressable style={styles.button}>
            <ThemedText variant="bodyStrong" >Modifier la recette</ThemedText>
          </Pressable>
        </Link>
        <Pressable onPress={() => handleDelete()} style={styles.button}>
          <ThemedText variant="bodyStrong" >Supprimer la recette</ThemedText>
        </Pressable>
        <Pressable onPress={() => addRecipeToShoppingList(Number(params.id))} style={styles.button}>
          <ThemedText variant="bodyStrong" >Ajouter à la liste de course</ThemedText>
        </Pressable>
        </Card>
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
    gap: Spacing.md,
    padding: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  ingredients: {
    gap: 8,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: Colors.orange,
  },
  steps: {
    gap: 8,
  },
  ingrDot: {
    width: 6, 
    height: 6, 
    borderRadius: 999,
    backgroundColor: '#ffd33d',
  },
  stepCircle: {
    width: 12, 
    height: 12, 
    borderRadius: 999,
    backgroundColor: '#ffd33d',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  body: {
    fontSize: 8,
    lineHeight: 16,
  },
    button: {
    padding: 8,
    backgroundColor: Colors.peach,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderColor: Colors.orange,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
})