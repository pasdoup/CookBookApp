import { ButtonNewRecipe } from "@/components/ButtonNewRecipe";
import { Chip } from "@/components/Chip";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import type { Recipe, RecipeRegime, RecipeType } from '@/data/types';
import { RECIPE_REGIMES, RECIPE_TYPES } from '@/data/types';
import { useRecipes } from "@/hooks/useRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ALL = 'Tous';

export default function Index() {
  const colors = useThemeColors()

  const { searchRecipes } = useRecipes();
  const [query,        setQuery]        = useState('');
  const [regimeFilter, setRegimeFilter] = useState<RecipeRegime | typeof ALL>(ALL);
  const [typeFilter,   setTypeFilter]   = useState<RecipeType   | typeof ALL>(ALL);
  const [results,      setResults]      = useState<Recipe[]>([]);


  const run = useCallback(async (q: string, regime: string, type: string) => {
      const res = await searchRecipes(
        q,
        regime !== ALL ? regime : undefined,
        type   !== ALL ? type   : undefined
      );
      setResults(res);
  }, [searchRecipes]);

  useEffect(() => {
     run(query, regimeFilter, typeFilter)
  }, [query, regimeFilter, typeFilter, run]);


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
        <SearchBar value={query} onChange={setQuery} />
        <FlatList 
          horizontal 
          data={[ALL, ...RECIPE_TYPES]} 
          contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
          keyExtractor={(item)=> item} 
          renderItem={({item}) => 
            <Pressable onPress={() =>  setTypeFilter(item as RecipeType | typeof ALL)}>
              <Chip name={item} active={typeFilter === item} />
            </Pressable>
          } 
        />
        <FlatList 
          horizontal 
          data={[ALL, ...RECIPE_REGIMES]} 
          contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
          renderItem={({item}) => 
            <Pressable onPress={() => setRegimeFilter(item as RecipeRegime | typeof ALL)}>
              <Chip name={item} active={regimeFilter === item} />
            </Pressable>} 
          keyExtractor={(item)=> item} 
        />
      </View>
      {/*------------------------ Body ------------------------*/}
      <View style={[styles.body]}>
        <FlatList 
          data={results} 
          contentContainerStyle={[styles.list]}
          renderItem={({item}) => 
              <RecipeCard id={item.id} title={item.title} time={item.time} type={item.type} regime={item.regime} />
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