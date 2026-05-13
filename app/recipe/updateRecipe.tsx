import { Card } from "@/components/Card";
import Form from "@/components/Form";
import { HeaderBorder } from "@/components/HeaderBorder";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants";
import { RecipeInput } from "@/data/types";
import { useRecipes } from "@/data/useRecipes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpdateRecipe() {
  const params = useLocalSearchParams()
  const { getRecipe, updateRecipe } = useRecipes();

  const recipe = getRecipe(Number(params.id));
  
  if (!recipe) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
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

  const update = async (data: RecipeInput) => { 
   await updateRecipe(recipe.id, data);
    router.navigate({
      pathname: "/recipe/id",
      params: { id: params.id } 
    })
  }

  return (
    <SafeAreaView style={[ styles.container, {backgroundColor: Colors.peach}]}>
        <Card style={styles.header} color={Colors.peach}>
          <Pressable onPress={router.back}>
            <Ionicons name='arrow-back-sharp' color={ Colors.orange } size={32}/>
          </Pressable> 
            <Row gap={Spacing.md}>
                <ThemedText variant="header" color={ Colors.orange }>Modifier la recette</ThemedText>
                <Ionicons name='sparkles-sharp' color={ Colors.orange } size={30}/>
            </Row>
            <HeaderBorder/>
        </Card>
      <ScrollView>
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
  header: {
    padding: Spacing.sm,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xxxl,
    height: 175,
  },
})

