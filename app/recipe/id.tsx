import { Card } from "@/components/Card";
import { RecipeDesc } from "@/components/recipe/RecipeDesc";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { addItems } from "@/functions/ItemFunctions";
import { deleteRecipe, getRecipeById } from "@/functions/RecipeFunctions";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Recipe() {
  const params = useLocalSearchParams()
  const colors = useThemeColors()
  const recipe = getRecipeById(Number(params.id))
  const recipeColor = recipe?.type as keyof typeof Colors.type
  const ingredients = recipe?.ingredients || [{ quantity: '', unity: '', name: '' }]
  const steps = recipe?.steps || []

  const addRecipeToList = () => {
    alert("Ajouter les ingrédients de cette recette à la liste de course ?") 
    addItems(ingredients.map(ing => ({ ...ing, isActive: true })))
  }

  const deleteRecipeById = (id: number) => { 
    Alert.alert("Êtes-vous sûr de vouloir supprimer cette recette ?", "", 
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => { 
            deleteRecipe(id)
            router.dismissAll()
        } },
      ]
    )
  }

  if (!recipe) {
    return (
      <SafeAreaView>
        <Pressable onPress={router.dismissAll}>
            <Image source={require("@/assets/images/back.png")} style={styles.logo} />
        </Pressable> 
        <View style={[styles.header, {backgroundColor: colors.header}]}>
          <ThemedText variant="headline">Go back</ThemedText>
        </View>
        <View>
          <Text>Recette introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {/*------------------------ Header ------------------------*/}
        <View style={[styles.header, {backgroundColor: Colors.type[recipeColor].bg}]}>
          <Pressable onPress={router.dismissAll}>
            <Image source={require("@/assets/images/back.png")} style={styles.logo} />
          </Pressable> 
          <ThemedText variant="headline">{recipe.title}</ThemedText>
          <RecipeDesc type={recipe.type} regime={recipe.regime as keyof typeof Colors["regime"]} time={recipe.time} />
        </View>
        {/*------------------------ Ingredients ------------------------*/}
        <Card style={styles.ingredients}>
          <ThemedText variant="headline">Ingrédients</ThemedText>
          {ingredients.map((ingredient, index) => (
            <Row gap={4} key={index}>
              <View style={styles.ingrDot} />
              {ingredient.quantity ? <ThemedText>{ingredient.quantity}</ThemedText> : null}
              {ingredient.unity ? <ThemedText>{ingredient.unity}</ThemedText> : null}
              <ThemedText>{ingredient.name}</ThemedText>
            </Row>
          ))}
        </Card>
        {/*------------------------ Steps ------------------------*/}
        <Card style={styles.steps}>
          <ThemedText variant="headline">Étapes</ThemedText>
          {steps.map((step, index) => (
            <Row gap={4} key ={index}>
              <View style={styles.stepCircle}>
                  <Text style={styles.body}>{index + 1}</Text>
              </View>
              <ThemedText>{step}</ThemedText>
            </Row>
          ))}
        </Card>
        {/*------------------------ Actions ------------------------*/}
        <Link href={{pathname: "/updateRecipe", params: {id: recipe.id}}} asChild>
          <Pressable style={{padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16}}>
            <ThemedText variant="bodyStrong" color="background">Modifier la recette</ThemedText>
          </Pressable>
        </Link>
        <Pressable onPress={() => deleteRecipeById(Number(params.id))} style={{padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16}}>
          <ThemedText variant="bodyStrong" color="background">Supprimer la recette</ThemedText>
        </Pressable>
        <Pressable onPress={() => addRecipeToList()} style={{padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16}}>
          <ThemedText variant="bodyStrong" color="background">Ajouter à la liste de course</ThemedText>
        </Pressable>
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
})