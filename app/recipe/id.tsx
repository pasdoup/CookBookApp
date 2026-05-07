import { Card } from "@/components/Card";
import { HeaderBorder } from "@/components/HeaderBorder";
import { RecipeDesc } from "@/components/recipe/RecipeDesc";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Radius, Spacing } from "@/constants";
import { formatIngredient } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router, useLocalSearchParams } from "expo-router";
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
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
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.peach}}>
        {/*------------------------ Header -------------------a refaire -----*/}
        <Card style={styles.header} color={Colors.peach}>
          <Pressable onPress={router.dismissAll}>
            <Image source={require("@/assets/images/back.png")} style={styles.logo} />
          </Pressable>
          <ThemedText variant="header">{recipe.title}</ThemedText>
          <RecipeDesc type={recipe.type} regime={recipe.regime as keyof typeof Colors.regimes} time={recipe.time} />
          <HeaderBorder/>
        </Card>

      <ScrollView style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}>
        <Card style={styles.main}>
        {/*------------------------ Ingredients ------------------------*/}
          <Card style={styles.ingredients}>
            <ThemedText variant="header2">✿ Ingrédients</ThemedText>
            <ThemedText variant="header2">- · ◆ ◇ ▸ ▹ ❖ ✦ ♡ ˖ ⁺</ThemedText>
            {recipe.ingredients.map((ingredient, index) => (
              <Row gap={Spacing.xs} key={index}>
                <ThemedText variant="body" color={Colors.lavander}>✦ </ThemedText>
                <ThemedText variant="body">{formatIngredient(ingredient)}</ThemedText>
              </Row>
            ))}
          </Card>
          {/*------------------------ Steps ------------------------*/}
          <Card style={styles.steps}>
            <ThemedText variant="header2">✿ Étapes</ThemedText>
            {recipe.steps.map((step, index) => (
              <Row gap={Spacing.xs} key ={index}>
                <View style={styles.stepCircle}>
                    <ThemedText variant="small">{index + 1}</ThemedText>
                </View>
                <ThemedText variant="body">{step}</ThemedText>
              </Row>
            ))}
          </Card>
        </Card>
      </ScrollView>
          {/*------------------------ Actions ------------------------*/}
      <Card style={styles.actions}>
          <Link href={{pathname: "/recipe/updateRecipe", params: {id: recipe.id}}} asChild>
            <Pressable style={styles.button}>
              <ThemedText variant="bodyStrong" >✎</ThemedText>
            </Pressable>
          </Link>
          <Pressable onPress={() => handleDelete()} style={styles.button}>
            <Ionicons name="trash-outline"/>
          </Pressable>
          <Pressable onPress={() => addRecipeToShoppingList(Number(params.id))} style={styles.button}>
            <Ionicons name="cart-outline"/>
            <ThemedText variant="bodyStrong" >Ajouter à la liste de course 🛒</ThemedText>
          </Pressable>
          </Card>
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
    gap: Spacing.md,
    padding: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  ingredients: {
    gap: Spacing.md,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: Colors.orange,
    paddingBottom: Spacing.lg,
  },
  steps: {
    gap: Spacing.md,
    flex: 1,
  },
  stepCircle: {
    width: Spacing.xl, 
    height: Spacing.xl, 
    borderRadius: Radius.full,
    backgroundColor: Colors.lavander,
    alignItems: 'center', 
    justifyContent: 'center',
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
  main: {
    padding: Spacing.sm,
    gap: Spacing.sm,
    flex: 1,
  },
  actions: {
    bottom: 0,
  },
})