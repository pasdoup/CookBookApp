import { Card } from "@/components/Card";
import { HeaderBorder } from "@/components/HeaderBorder";
import { RecipeDesc } from "@/components/recipe/RecipeDesc";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Radius, Spacing } from "@/constants";
import { formatIngredient } from "@/data/types";
import { useRecipes } from "@/data/useRecipes";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Recipe() {
  const params = useLocalSearchParams()
  const { getRecipe, deleteRecipe, addRecipeToShoppingList } = useRecipes();

  const recipe = getRecipe(Number(params.id));


  if (!recipe) {
    return (
      <SafeAreaView style={[ {backgroundColor: Colors.peach}]}>
        <Pressable onPress={router.dismissAll}>
          <Ionicons name='arrow-back-sharp' color={ Colors.orange } size={32}/>
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
      'Voulez-vous vraiment supprimer "${recipe.title}" ?',
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
      {/*------------------------------------------------ Header ------------------------------------------------*/}
      <Card style={styles.header} color={Colors.peach}>
        <Pressable onPress={router.dismissAll}>
          <Ionicons name='arrow-back-sharp' color={ Colors.orange } size={32}/>
        </Pressable> 
        <Row gap={Spacing.md}>
          <ThemedText variant="header" color={ Colors.orange }>{recipe.title}</ThemedText>
          <Ionicons name='sparkles-sharp' color={ Colors.orange } size={30}/>
        </Row>
        <RecipeDesc type={recipe.type} regime={recipe.regime as keyof typeof Colors.regimes} time={recipe.time} />
        <HeaderBorder/>
      </Card>

      <ScrollView style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}>
        <Card style={styles.main}>
        {/*------------------------------------------------ Ingredients ------------------------------------------------*/}
          <Card style={styles.ingredients}>
            <ThemedText variant="header2">✿ Ingrédients</ThemedText>
            {recipe.ingredients.map((ingredient, index) => (
              <Row gap={Spacing.xs} key={index}>
                <ThemedText variant="list" color={Colors.peach}>✦ </ThemedText>
                <ThemedText variant="body">{formatIngredient(ingredient)}</ThemedText>
              </Row>
            ))}
          </Card>
          {/*------------------------------------------------ Steps ----------------------------------------------------*/}
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
      {/*--------------------------------------------------- Actions ---------------------------------------------------*/}
      <Card style={styles.actions}>
        <Link href={{pathname: "/recipe/updateRecipe", params: {id: recipe.id}}} asChild>
          <Pressable style={styles.button} android_ripple={{color: Colors.orange, foreground: true}}>
            <Ionicons name="pencil-outline" size={32} color={ Colors.orange } />
          </Pressable>
        </Link>
        <Pressable onPress={() => handleDelete()} style={styles.buttonDelete} android_ripple={{color: Colors.orange, foreground: true}}>
          <Ionicons name="trash-outline" size={32} color={ Colors.orange } />
        </Pressable>
        <Pressable onPress={() => addRecipeToShoppingList(Number(params.id))} style={styles.button} android_ripple={{color: Colors.orange, foreground: true}}>
          <Ionicons name="cart-outline" size={32} color={ Colors.orange }/>
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
    gap: Spacing.lg,
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
    backgroundColor: Colors.peach,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  button: {
    padding: Spacing.xs,
    backgroundColor: Colors.peach,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.xxs,
    borderColor: Colors.orange,
    borderWidth: 1,
    borderBottomWidth: 3,
    flex: 1,
  },
  buttonDelete: {
    padding: Spacing.xs,
    backgroundColor: Colors.vanilla,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.xxs,
    borderColor: Colors.orange,
    borderWidth: 1,
    borderBottomWidth: 3,
    flex: 1,
  },
  main: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    flex: 1,
  },
  actions: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
})