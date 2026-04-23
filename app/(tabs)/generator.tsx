import { Chip } from "@/components/Chip";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Regimes } from "@/constants/Regimes";
import { Types } from "@/constants/Types";
import { getRandomRecipeId } from "@/functions/RecipeFunctions";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Generator() {
  const colors = useThemeColors()
  const [activeTypes, setActiveTypes] = useState('Tous')
  const [activeRegimes, setActiveRegimes] = useState('Tous')
  const [idRecipeId, setIdRecipeId] = useState<number | null>(null)
  
  const random = () => {
    setIdRecipeId(getRandomRecipeId(activeTypes, activeRegimes))
  }
  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top', 'left', 'right']}>
    {/*------------------------ Header ------------------------*/}
    <View style={[styles.header, {backgroundColor: colors.header}]}>
      <Row gap={16}>
        <Image source={require("@/assets/images/dice.png")} style={styles.logo} />
        <ThemedText variant="headline" color="text">Quoi manger ?</ThemedText>
      </Row>
    </View>
    {/*------------------------ Filters ------------------------*/}
    <View style={[styles.search]}>
      <FlatList 
        horizontal 
        data={Types} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item)=> item}
        renderItem={({item}) => 
          <Pressable onPress={() => setActiveTypes(item)}><Chip name={item} active={activeTypes === item} /></Pressable>} 
      />
      <FlatList 
        horizontal 
        data={Regimes} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item)=> item} 
        renderItem={({item}) => 
          <Pressable onPress={() => setActiveRegimes(item)}><Chip name={item} active={activeRegimes === item} /></Pressable>} 
      />
    </View>
    {/*------------------------ Body ------------------------*/}
    <View style={[styles.body]}>
      <View>
      <Pressable onPress={random}>
        <View style={styles.buttonSave}>
            <ThemedText variant="bodyStrong">Trouver une recette</ThemedText>
        </View>
      </Pressable> 
      </View>
      <View style={{flex: 1}}>
      {idRecipeId ? (
        <RecipeCard id={idRecipeId} style={{height: 'auto', minHeight: 80}} />
      ) : (
        <View style={styles.noRecipe}>
          <ThemedText variant="body" color="text">Aucune recette trouvée avec ces filtres</ThemedText>
        </View>
      )}
      </View>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 24, 
    height: 24
  },
  header: {
    gap: 16,
    padding: 12,
  },
  search: {
    gap: 8,
  },
  body: {
    flex: 1,
    gap: 12,
    padding: 12,
  },
  buttonSave: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    },
  noRecipe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
