import { Card } from "@/components/Card";
import Form from "@/components/Form";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { getRecipeById, updateRecipe } from "@/functions/RecipeFunctions";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpdateRecipe() {
  const colors = useThemeColors()
  const params = useLocalSearchParams()
  const recipe = getRecipeById(Number(params.id))
  
  const update = (value: string) => { 
   updateRecipe(Number(params.id), JSON.parse(value))
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
          <Form onSubmit={update} recipe={recipe}/>
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

