import { Card } from "@/components/Card";
import Form from "@/components/Form";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { RecipeInput } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateRecipe() {
  const colors = useThemeColors()
  const { addRecipe } = useRecipes();

  const handleSubmit = async (data: RecipeInput) => {
    await addRecipe(data);
    router.dismissAll()
    // router.navigate({
    //   pathname: "/recipe/id",
    //   params: { id: id } 
    // })
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[styles.header, {backgroundColor: colors.header}]}>
          <Pressable onPress={router.back}>
            <Image source={require("@/assets/images/back.png")} style={styles.logo} />
          </Pressable> 
          <ThemedText variant="headline">Nouvelle recette</ThemedText>
        </View>
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