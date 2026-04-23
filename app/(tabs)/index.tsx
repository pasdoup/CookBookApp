import { ButtonNewRecipe } from "@/components/ButtonNewRecipe";
import { Chip } from "@/components/Chip";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import { Regimes } from "@/constants/Regimes";
import { Types } from "@/constants/Types";
import { filterRecipes } from "@/functions/RecipeFunctions";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const colors = useThemeColors()
  const [search, setSearch] = useState('')
  const [activeTypes, setActiveTypes] = useState('Tous')
  const [activeRegimes, setActiveRegimes] = useState('Tous')
  const displayedRecipes = filterRecipes(search, activeTypes, activeRegimes)

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top', 'left', 'right']}>
      {/*------------------------ Header ------------------------*/}
      <View style={[styles.header, {backgroundColor: colors.header}]}>
        <Row gap={16}>
          <Image source={require("@/assets/images/iconBook.png")} style={styles.logo} />
          <ThemedText variant="headline" color="text">Mes recettes</ThemedText>
        </Row>
      </View>
      {/*------------------------ Search & Filters ------------------------*/}
      <View style={[styles.search]}>
        <SearchBar value={search} onChange={setSearch} />
        <FlatList 
          horizontal 
          data={Types} 
          contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
          keyExtractor={(item)=> item} 
          renderItem={({item}) => 
            <Pressable onPress={() => setActiveTypes(item)}>
              <Chip name={item} active={activeTypes === item} />
            </Pressable>
          } 
        />
        <FlatList 
          horizontal 
          data={Regimes} 
          contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
          renderItem={({item}) => 
            <Pressable onPress={() => setActiveRegimes(item)}>
              <Chip name={item} active={activeRegimes === item} />
            </Pressable>} 
          keyExtractor={(item)=> item} 
        />
      </View>
      {/*------------------------ Body ------------------------*/}
      <View style={[styles.body]}>
        <FlatList 
          data={displayedRecipes} 
          contentContainerStyle={[styles.list]}
          renderItem={({item}) => 
              <RecipeCard id={item.id} />
          } 
          keyExtractor={(item)=> item.id.toString() }
        />

        <ButtonNewRecipe style={styles.buttonNewRecipe}/>

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
    borderRadius: 4,
    position: 'relative',
  },
  list: {
    gap: 8,
    padding: 12,
  },
  buttonNewRecipe: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{translateX: -37.5}],
  }
})